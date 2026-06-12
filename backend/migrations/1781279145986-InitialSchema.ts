import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1781279145986 implements MigrationInterface {
    name = 'InitialSchema1781279145986'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "state_market_data" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "state_name" character varying NOT NULL, "demand_score" integer NOT NULL, "supply_score" integer NOT NULL, "trend" character varying NOT NULL, "shortage_risk" character varying NOT NULL, "opportunity" boolean NOT NULL, "product" character varying NOT NULL, "price_per_unit" numeric(12,2), "price_trend" jsonb, "nearby_suppliers" integer NOT NULL DEFAULT '0', "trend_7days" text, "price_history" text, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_ccf0e4e94df86a976fa1c974f2c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."stock_posts_status_enum" AS ENUM('available', 'wanted')`);
        await queryRunner.query(`CREATE TABLE "stock_posts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "product" character varying NOT NULL, "quantity" character varying NOT NULL, "price_per_unit" numeric(12,2), "status" "public"."stock_posts_status_enum" NOT NULL, "description" text, "state" character varying NOT NULL, "lga" text, "expires_at" TIMESTAMP NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "trader_id" uuid NOT NULL, CONSTRAINT "PK_83ec4a78bcdbd0ea9384cdb6380" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "full_name" character varying NOT NULL, "industry" character varying NOT NULL, "email" character varying NOT NULL, "password_hash" character varying NOT NULL, "rating" numeric(3,2) NOT NULL DEFAULT '0', "total_ratings" integer NOT NULL DEFAULT '0', "verified" boolean NOT NULL DEFAULT false, "refresh_token_hash" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "ratings" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "score" integer NOT NULL, "comment" text, "transaction_product" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "rater_id" uuid NOT NULL, "rated_trader_id" uuid NOT NULL, CONSTRAINT "UQ_211d1ad487efd1654c44b3d7f39" UNIQUE ("rater_id", "rated_trader_id", "transaction_product"), CONSTRAINT "PK_0f31425b073219379545ad68ed9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "stock_posts" ADD CONSTRAINT "FK_131bd877c34d7c4c4d73f5d5d00" FOREIGN KEY ("trader_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ratings" ADD CONSTRAINT "FK_a5f23ba85e0f0d183b0a57476a8" FOREIGN KEY ("rater_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ratings" ADD CONSTRAINT "FK_c8fda12f4f5489de0c0b84ccfae" FOREIGN KEY ("rated_trader_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ratings" DROP CONSTRAINT "FK_c8fda12f4f5489de0c0b84ccfae"`);
        await queryRunner.query(`ALTER TABLE "ratings" DROP CONSTRAINT "FK_a5f23ba85e0f0d183b0a57476a8"`);
        await queryRunner.query(`ALTER TABLE "stock_posts" DROP CONSTRAINT "FK_131bd877c34d7c4c4d73f5d5d00"`);
        await queryRunner.query(`DROP TABLE "ratings"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "stock_posts"`);
        await queryRunner.query(`DROP TYPE "public"."stock_posts_status_enum"`);
        await queryRunner.query(`DROP TABLE "state_market_data"`);
    }

}
