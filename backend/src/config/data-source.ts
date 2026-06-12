import 'reflect-metadata';
import { config as dotenvConfig } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';

dotenvConfig({ path: '.env' });

const options: DataSourceOptions = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  migrations: [
    __dirname + '/../../migrations/*.{js,ts}',
    __dirname + '/../../dist/migrations/*.{js,ts}',
  ],
  synchronize: false,
  ssl: {
    rejectUnauthorized: false,
  },
};

export default new DataSource(options);

