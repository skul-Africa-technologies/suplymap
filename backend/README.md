# MapGoods Nigeria Backend

Production NestJS backend for MapGoods Nigeria: market intelligence, trade discovery, stock broadcasting, ratings, and AI trade recommendations.

## Stack

- NestJS with TypeScript strict mode
- TypeORM repositories with PostgreSQL migrations
- Supabase PostgreSQL session-mode pooler connection string
- JWT access and refresh token authentication with Passport
- bcrypt password and refresh-token hashing
- Claude AI recommendations through the Anthropic Messages API
- Swagger/OpenAPI at `/api/docs`

## Setup

```bash
cp .env.example .env
npm install
npm run migration:run
npm run start:dev
```

`.env` is gitignored. Copy every value from `.env.example`; startup validation refuses missing or invalid environment variables.

## Migrations

```bash
npm run migration:generate
npm run migration:run
npm run migration:revert
```

TypeORM is configured with `synchronize: false` and `migrationsRun: true`.

## API

Swagger is available at:

```text
http://localhost:3000/api/docs
```

All endpoints require Bearer JWT except:

- `POST /api/auth/register`
- `POST /api/auth/login`

Refresh rotation uses:

- `POST /api/auth/refresh`

Logout invalidates the stored refresh-token hash:

- `POST /api/auth/logout`

## Frontend token guidance

`JWT_ACCESS_EXPIRES_IN=15m` is intentionally short. Web and mobile clients should implement silent refresh with the refresh token before each access-token expiry.

## Seed data

On startup, `MarketService` reads `data/*.json` and idempotently seeds `state_market_data`.
