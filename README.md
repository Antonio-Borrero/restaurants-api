# Restaurant Menu API

API REST para la gestión de la carta de restaurantes (categorías y platos), pensada desde el inicio para funcionar con múltiples restaurantes y múltiples idiomas.

🔗 **API en vivo:** https://restaurants-api-a2hv.onrender.com

> **Nota:** esta API corre en el plan gratuito de Render, que "duerme" el servicio tras 15 minutos sin tráfico. Si hace tiempo que nadie la usa, la primera petición puede tardar entre 30 y 60 segundos en responder mientras el servidor se reactiva — las siguientes son inmediatas. No es un error, es el comportamiento esperado de este plan.

## Stack

- Node.js 24 (TypeScript nativo, sin build step)
- Express 5
- Prisma ORM 7 + PostgreSQL 18
- Zod (validación de datos)
- argon2 + JWT (autenticación)
- Vitest + Supertest (tests de integración)
- Docker Compose (base de datos local)

## Arquitectura

El proyecto sigue una arquitectura en capas, cada una con una única responsabilidad:

```
src/
  routes/         # mapeo de URL -> controlador, sin lógica
  controllers/    # lectura de req/res, códigos de estado HTTP
  services/       # lógica de negocio y acceso a datos (Prisma)
  mappers/        # dan forma a los datos de Prisma para el cliente
  schemas/        # validación de entrada (Zod)
  errors/         # jerarquía de errores propios (AppError, NotFoundError, ConflictError)
  middlewares/    # manejo de errores centralizado
  config/         # configuración transversal (CORS)
  lib/            # instancia única del cliente de Prisma
tests/            # tests de integración (uno por recurso) + helpers compartidos
```

## Modelo de datos

- Un `User` puede pertenecer a varios `Restaurant` (y viceversa) mediante `RestaurantMember`, con un cargo descriptivo libre (`role`) y una lista de permisos concretos (`permissions`), configurables por restaurante.
- Cada `Restaurant` tiene un perfil extendido opcional (`address`, `telephone`, `email`, `cuisineType`, `description`, `imageUrl`), pensado para completarse desde el panel administrativo con el tiempo.
- Cada `Restaurant` define sus propias `Category` (libres, sin categorías fijas), y cada `Category` sus propios `Dish`.
- Los nombres de categorías y platos son multi-idioma: viven en tablas de traducción (`CategoryTranslation`, `DishTranslation`), no en columnas fijas — soporta cualquier idioma sin migrar el esquema.
- El precio se guarda como `Decimal` (no `Float`), para evitar errores de precisión al trabajar con dinero.
- Borrados destructivos (categoría, restaurante) requieren confirmación explícita (`?confirm=true`) si tienen contenido asociado.
- Quien crea un restaurante queda automáticamente como su primer miembro, con los 5 permisos disponibles.

## Autenticación y permisos

- Registro/login con contraseñas hasheadas (argon2) y sesión vía JWT (`Authorization: Bearer <token>`).
- Los permisos son configurables por restaurante, no roles fijos. Cada restaurante decide qué combinación de permisos le da a cada persona, de esta lista cerrada:
  - `MANAGE_MENU` — crear, editar o borrar categorías y platos
  - `EDIT_RESTAURANT` — editar los datos del restaurante
  - `DELETE_RESTAURANT` — borrar el restaurante completo
  - `MANAGE_MEMBERS` — invitar o quitar miembros
  - `MANAGE_PERMISSIONS` — asignar o cambiar los permisos de un miembro
- Las rutas de lectura (menú, categoría o plato individual) son públicas, sin autenticación.

## Manejo de errores

Todas las respuestas de error siguen el mismo formato:

```json
{ "error": { "code": "DISH_NOT_FOUND", "message": "Dish not found" } }
```

`code` es estable y en inglés (pensado para que el consumidor de la API decida qué hacer); `message` es legible para humanos. Los errores de validación (Zod) además incluyen un array `details` con el campo y mensaje específico de cada uno.

## CORS

Configurado dinámicamente según el método de la petición: las rutas de lectura (`GET`) aceptan cualquier origen (pensado para que cualquier web de restaurante o app externa pueda mostrar su carta); las rutas de escritura (`POST`/`PATCH`/`DELETE`) están restringidas al origen definido en `ADMIN_PANEL_ORIGIN`.

## Requisitos previos

- Node.js 24+
- Docker Desktop

## Puesta en marcha

1. Levanta la base de datos:

```bash
   docker compose up -d
```

2. Instala dependencias:

```bash
   npm install
```

3. Copia `.env.example` a `.env` y ajusta los valores.
4. Aplica las migraciones:

```bash
   npx prisma migrate dev
```

5. Arranca el servidor en modo desarrollo:

```bash
   npm run dev
```

## Tests

Los tests de integración corren contra una base de datos separada, dedicada solo a pruebas.

1. Crea una base de datos de test en el mismo contenedor de Postgres:

```bash
   docker exec -it restaurants-api-db-1 psql -U <tu_usuario> -d <tu_base> -c "CREATE DATABASE restaurants_api_test;"
```

2. Copia `.env.test.example` a `.env.test` y ajusta los valores (usando el nombre de la base de test).
3. Aplica las migraciones a esa base:

```bash
   npx dotenv -e .env.test -- npx prisma migrate deploy
```

4. Corre los tests:

```bash
   npm test
```

**Importante**: cada vez que se aplique una migración nueva contra la base de desarrollo (`npx prisma migrate dev`), repetir el paso 3 para mantener la base de test sincronizada — si no, los tests fallan con errores de columna faltante.

## Endpoints disponibles

| Método | Ruta                                        | Auth                  | Descripción                                                                                                     |
| ------ | ------------------------------------------- | --------------------- | --------------------------------------------------------------------------------------------------------------- |
| POST   | `/auth/register`                            | —                     | Registra un usuario                                                                                             |
| POST   | `/auth/login`                               | —                     | Inicia sesión, devuelve un JWT                                                                                  |
| POST   | `/restaurants`                              | 🔒                    | Crea un restaurante (el creador queda como miembro con todos los permisos)                                      |
| GET    | `/restaurants`                              | 🔒                    | Lista los restaurantes del usuario autenticado, con su rol, permisos, y conteo de categorías/platos en cada uno |
| GET    | `/restaurants/:restaurantId/menu?locale=es` | —                     | Devuelve el menú completo del restaurante en el idioma pedido                                                   |
| PATCH  | `/restaurants/:restaurantId`                | 🔒 EDIT_RESTAURANT    | Actualiza un restaurante                                                                                        |
| DELETE | `/restaurants/:restaurantId?confirm=true`   | 🔒 DELETE_RESTAURANT  | Elimina un restaurante (pide confirmación si tiene contenido)                                                   |
| POST   | `/restaurants/:restaurantId/categories`     | 🔒 MANAGE_MENU        | Crea una categoría (con traducciones)                                                                           |
| GET    | `/categories/:categoryId?locale=es`         | —                     | Devuelve una categoría individual                                                                               |
| PATCH  | `/categories/:categoryId`                   | 🔒 MANAGE_MENU        | Actualiza las traducciones de una categoría                                                                     |
| DELETE | `/categories/:categoryId?confirm=true`      | 🔒 MANAGE_MENU        | Elimina una categoría (pide confirmación si tiene platos)                                                       |
| POST   | `/categories/:categoryId/dishes`            | 🔒 MANAGE_MENU        | Crea un plato (con traducciones)                                                                                |
| GET    | `/dishes/:dishId?locale=es`                 | —                     | Devuelve un plato individual                                                                                    |
| PATCH  | `/dishes/:dishId`                           | 🔒 MANAGE_MENU        | Actualiza un plato (campos y/o traducciones)                                                                    |
| DELETE | `/dishes/:dishId`                           | 🔒 MANAGE_MENU        | Elimina un plato                                                                                                |
| POST   | `/restaurants/:restaurantId/members`        | 🔒 MANAGE_MEMBERS     | Invita a un usuario ya registrado como miembro                                                                  |
| PATCH  | `/members/:memberId/permissions`            | 🔒 MANAGE_PERMISSIONS | Asigna o cambia los permisos de un miembro                                                                      |
| DELETE | `/members/:memberId`                        | 🔒 MANAGE_MEMBERS     | Quita a un miembro del restaurante                                                                              |

## Herramientas útiles durante el desarrollo

- `npx prisma studio` — interfaz visual para ver y editar los datos directamente.
- Postman — para probar los endpoints manualmente.

## Pendiente

- Documentación de API (OpenAPI, generada desde los schemas de Zod)
- CI/CD (GitHub Actions)
- Despliegue en hosting real
- Rate limiting en login, recuperación de contraseña, soft delete para restaurantes
