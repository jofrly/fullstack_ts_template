import { DataSource, DataSourceOptions } from 'typeorm';
import { join } from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

interface DatabaseConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
}
 
let databaseConfig: DatabaseConfig;
if (process.env.NODE_ENV === 'test') {
  databaseConfig = {
    host: process.env.DB_TEST_HOST,
    port: +process.env.DB_TEST_PORT,
    username: process.env.DB_TEST_USERNAME,
    password: process.env.DB_TEST_PASSWORD,
    database: process.env.DB_TEST_NAME,
  };
} else {
  databaseConfig = {
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  };
}

// the data source options config is used both in the datasource exported from this file
// and inside the app.module.ts which configures typeorm for the nest application
export const dataSourceConfig: DataSourceOptions = {
  type: 'postgres',
  ...databaseConfig,
  migrations: [
    join(__dirname, 'src/db/migrations/*.ts')
  ],
  entities: [
    join(__dirname, 'src/entities/*.entity.{js,ts}'),
  ],
  dropSchema: false,
  synchronize: false,
};
 
// the typeorm cli uses the default export of this file (see package.json) which needs to be a data source
// by providing the data source to the typeorm cli, it is able to automatically generate migrations
export default new DataSource(dataSourceConfig);
