import * as dotenv from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';

dotenv.config();

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST || '127.0.0.1',
  port: parseInt(process.env.POSTGRES_PORT) || 5432,
  username: process.env.POSTGRES_USERNAME || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'password',
  database: process.env.POSTGRES_DATABASE || 'dubla_ai',
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  migrationsTableName: 'migrations',
  migrations: ['dist/migrations/*.js'],
  synchronize: false,
};
export default new DataSource(dataSourceOptions);
