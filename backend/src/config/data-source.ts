import 'reflect-metadata';
import { config as dotenvConfig } from 'dotenv';
import { ConfigService } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { databaseConfig } from './database.config';

dotenvConfig({ path: '.env' });

const configService = new ConfigService();
const options = databaseConfig(configService) as DataSourceOptions;

export default new DataSource({
  ...options,
  migrations: ['./migrations/*.ts'],
});
