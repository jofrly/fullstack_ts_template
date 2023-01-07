import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  const port = process.env.NODE_ENV === 'test' ? 3001 : 3000;
  await app.listen(port);
}
bootstrap();
