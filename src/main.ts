import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from 'src/validation/validation.pipe';
import { AppDataSource } from 'src/config/data-source';

dotenv.config();

async function bootstrap() {
  await AppDataSource.initialize();
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');
  const config = new DocumentBuilder()
    .setTitle('nestjs-task-management')
    .setDescription('The nestjs-task-management API description')
    .setVersion('1.0')
    .addTag('tasks')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
