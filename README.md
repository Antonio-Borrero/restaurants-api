# Restaurant Menu API

API REST para la gestión de la carta de restaurantes (categorías y platos), construida como proyecto de aprendizaje de backend.

## Stack

- Node.js 24 (TypeScript nativo, sin build step)
- Express 5
- Prisma ORM 7 + PostgreSQL 18
- Docker Compose (base de datos local)

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
