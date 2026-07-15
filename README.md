# Restaurant Menu API

API REST para la gestión de la carta de restaurantes (categorías y platos), pensada desde el inicio para funcionar con múltiples restaurantes y múltiples idiomas.

## Stack

- Node.js 24 (TypeScript nativo, sin build step)
- Express 5
- Prisma ORM 7 + PostgreSQL 18
- Zod (Validación de datos)
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
  middlewares/    # manejo de errores centralizado
  lib/            # instancia única del cliente de Prisma
```

## Modelo de datos

- Un `User` puede pertenecer a varios `Restaurant` (y viceversa) mediante `RestaurantMember`, con un rol asociado (`OWNER`, `STAFF`...).
- Cada `Restaurant` define sus propias `Category` (libres, sin categorías fijas), y cada `Category` sus propios `Dish`.
- Los nombres de categorías y platos son multi-idioma: viven en tablas de traducción (`CategoryTranslation`, `DishTranslation`), no en columnas fijas — soporta cualquier idioma sin migrar el esquema.
- El precio se guarda como `Decimal` (no `Float`), para evitar errores de precisión al trabajar con dinero.

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
   ```
   npm run dev
   ```

# Endpoints disponibles

| Método | Ruta                                        | Descripción                                                   |
| ------ | ------------------------------------------- | ------------------------------------------------------------- |
| POST   | `/restaurants`                              | Crea un restaurante                                           |
| POST   | `/restaurants/:restaurantId/categories`     | Crea una categoría (con traducciones)                         |
| POST   | `/categories/:categoryId/dishes`            | Crea un plato (con traducciones)                              |
| GET    | `/restaurants/:restaurantId/menu?locale=es` | Devuelve el menú completo del restaurante en el idioma pedido |

## Herramientas útiles durante el desarrollo

- `npx prisma studio` — interfaz visual para ver y editar los datos directamente.
- Postman — para probar los endpoints manualmente.

## Pendiente

- `GET`/`PUT`/`DELETE` para el resto de recursos
- Autenticación y permisos por restaurante
- Tests automatizados (Vitest + Supertest)
