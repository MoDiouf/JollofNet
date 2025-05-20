import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as bodyParser from 'body-parser';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.setBaseViewsDir(join(__dirname,'..','views'))
  app.useStaticAssets(join(__dirname,'..','public'))
  app.setViewEngine('ejs')
  app.useGlobalPipes(new ValidationPipe());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
