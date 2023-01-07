import { DataSource, DataSourceOptions } from 'typeorm';
import { join } from 'path';
import * as dotenv from 'dotenv';
 
dotenv.config();

// the data source options config is used both in the datasource exported from this file
// and inside the app.module.ts which configures typeorm for the nest application
export const dataSourceConfig: DataSourceOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  migrations: [
    join(__dirname, 'src/db/migrations/*.ts')
  ],
  entities: [
    join(__dirname, 'src/**/*.entity.ts'),
  ],
  dropSchema: false,
  synchronize: false,
};
 
// the typeorm cli uses the default export of this file (see package.json) which needs to be a data source
// by providing the data source to the typeorm cli, it is able to automatically generate migrations
export default new DataSource(dataSourceConfig);
