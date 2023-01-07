import { NestFactory } from '@nestjs/core';
import { DataSource } from 'typeorm';

import { AppModule } from '../../../src/app.module';
import { FactoryBot, purgeDatabase } from '../../../specs/support/general';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get<DataSource>(DataSource);
  FactoryBot.dataSource = dataSource;

  await purgeDatabase(dataSource);
  await seedData();

  await app.close();
}
bootstrap();

async function seedData(): Promise<void> {
  await FactoryBot.create('post', { title: 'first post title', body: 'first post body' });
  await FactoryBot.create('post',  { title: 'second post title', body: 'second post body' });
}
