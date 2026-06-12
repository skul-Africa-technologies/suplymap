import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1718180000000 implements MigrationInterface {
  name = 'InitialSchema1718180000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS pgcrypto;`);

    await queryRunner.query(`
      DO $$
      BEGIN
        CREATE TYPE trader_role AS ENUM ('retailer', 'wholesaler', 'distributor', 'manufacturer');
      EXCEPTION
        WHEN duplicate_object THEN NULL;
      END
      $$;
    `);

    await queryRunner.query(`
      DO $$
      BEGIN
        CREATE TYPE stock_status AS ENUM ('available', 'wanted');
      EXCEPTION
        WHEN duplicate_object THEN NULL;
      END
      $$;
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        full_name VARCHAR NOT NULL,
        email VARCHAR NOT NULL UNIQUE,
        phone VARCHAR NOT NULL,
        password_hash VARCHAR NOT NULL,
        role trader_role NOT NULL,
        products TEXT NOT NULL,
        state VARCHAR NOT NULL,
        lga VARCHAR,
        rating NUMERIC(3, 2) NOT NULL DEFAULT 0,
        total_ratings INTEGER NOT NULL DEFAULT 0,
        verified BOOLEAN NOT NULL DEFAULT false,
        refresh_token_hash VARCHAR,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS stock_posts (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        product VARCHAR NOT NULL,
        quantity VARCHAR NOT NULL,
        price_per_unit NUMERIC(12, 2),
        status stock_status NOT NULL,
        description TEXT,
        state VARCHAR NOT NULL,
        lga VARCHAR,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        trader_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE
      );
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS ratings (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        score INTEGER NOT NULL,
        comment TEXT,
        transaction_product VARCHAR NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        rater_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        rated_trader_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        CONSTRAINT ratings_rater_trader_product_unique UNIQUE (rater_id, rated_trader_id, transaction_product)
      );
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS state_market_data (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        state_name VARCHAR NOT NULL,
        demand_score INTEGER NOT NULL,
        supply_score INTEGER NOT NULL,
        trend VARCHAR NOT NULL,
        shortage_risk VARCHAR NOT NULL,
        opportunity BOOLEAN NOT NULL,
        product VARCHAR NOT NULL,
        price_per_unit NUMERIC(12, 2),
        price_trend VARCHAR,
        nearby_suppliers INTEGER NOT NULL DEFAULT 0,
        trend_7days TEXT,
        price_history TEXT,
        updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
        CONSTRAINT state_market_data_state_product_unique UNIQUE (state_name, product)
      );
    `);

    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_stock_posts_trader_id ON stock_posts (trader_id);`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_stock_posts_product_state ON stock_posts (product, state);`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_ratings_rated_trader_id ON ratings (rated_trader_id);`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_state_market_data_product ON state_market_data (product);`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS idx_state_market_data_product;`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_ratings_rated_trader_id;`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_stock_posts_product_state;`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_stock_posts_trader_id;`);
    await queryRunner.query(`DROP TABLE IF EXISTS state_market_data;`);
    await queryRunner.query(`DROP TABLE IF EXISTS ratings;`);
    await queryRunner.query(`DROP TABLE IF EXISTS stock_posts;`);
    await queryRunner.query(`DROP TABLE IF EXISTS users;`);
    await queryRunner.query(`DROP TYPE IF EXISTS stock_status;`);
    await queryRunner.query(`DROP TYPE IF EXISTS trader_role;`);
  }
}
