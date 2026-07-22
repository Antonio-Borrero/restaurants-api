# Restaurant Menu API

API REST para la gestión de la carta de restaurantes (categorías y platos), pensada desde el inicio para funcionar con múltiples restaurantes y múltiples idiomas.

## Stack

- Node.js 24 (TypeScript nativo, sin build step)
- Express 5
- Prisma ORM 7 + PostgreSQL 18
- Zod (validación de datos)
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
  lib/            # instancia única del cliente de Prisma
tests/            # tests de integración (uno por recurso)
```

## Modelo de datos

- Un `User` puede pertenecer a varios `Restaurant` (y viceversa) mediante `RestaurantMember`, con un rol asociado (`OWNER`, `STAFF`...).
- Cada `Restaurant` define sus propias `Category` (libres, sin categorías fijas), y cada `Category` sus propios `Dish`.
- Los nombres de categorías y platos son multi-idioma: viven en tablas de traducción (`CategoryTranslation`, `DishTranslation`), no en columnas fijas — soporta cualquier idioma sin migrar el esquema.
- El precio se guarda como `Decimal` (no `Float`), para evitar errores de precisión al trabajar con dinero.
- Borrados destructivos (categoría, restaurante) requieren confirmación explícita (`?confirm=true`) si tienen contenido asociado.

## Manejo de errores

Todas las respuestas de error siguen el mismo formato:

```json
{ "error": { "code": "DISH_NOT_FOUND", "message": "Dish not found" } }
```

`code` es estable y en inglés (pensado para que el consumidor de la API decida qué hacer); `message` es legible para humanos. Los errores de validación (Zod) además incluyen un array `details` con el campo y mensaje específico de cada uno.

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

## Endpoints disponibles

| Método | Ruta                                        | Descripción                                                   |
| ------ | ------------------------------------------- | ------------------------------------------------------------- |
| POST   | `/restaurants`                              | Crea un restaurante                                           |
| GET    | `/restaurants/:restaurantId/menu?locale=es` | Devuelve el menú completo del restaurante en el idioma pedido |
| PATCH  | `/restaurants/:restaurantId`                | Actualiza un restaurante                                      |
| DELETE | `/restaurants/:restaurantId?confirm=true`   | Elimina un restaurante (pide confirmación si tiene contenido) |
| POST   | `/restaurants/:restaurantId/categories`     | Crea una categoría (con traducciones)                         |
| GET    | `/categories/:categoryId?locale=es`         | Devuelve una categoría individual                             |
| PATCH  | `/categories/:categoryId`                   | Actualiza las traducciones de una categoría                   |
| DELETE | `/categories/:categoryId?confirm=true`      |
