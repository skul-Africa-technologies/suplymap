import { NestFactory, Reflector } from '@nestjs/core';
import { ValidationPipe, ClassSerializerInterceptor, Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { NestExpressApplication } from '@nestjs/platform-express';
import AppDataSource from './config/data-source';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  // Apply pending migrations before the app starts
  try {
    logger.log('🔄 Running pending migrations...');
    await AppDataSource.initialize();
    await AppDataSource.runMigrations();
    await AppDataSource.destroy();
    logger.log('✅ Migrations applied successfully.');
  } catch (err) {
    logger.error('❌ Migration failed:', err);
    if (err instanceof Error) {
      throw new Error('Startup aborted: migration error. ' + err.message);
    }
    throw err;
  }

  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.set('trust proxy', 1);

  // 🔒 Security
  app.use(helmet());
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 200,
    }),
  );

  const configService = app.get(ConfigService);
  const PORT = configService.get<number>('PORT') || 3001;

  // 🌍 CORS
  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: false,
  });

  // 🌐 Global prefix
  app.setGlobalPrefix('api/v1');

  // 🧰 Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // ✅ Interceptors
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector)),
  );

  // 📘 Swagger
  const swaggerConfig = new DocumentBuilder()
    .setTitle('suplymap')
    .setDescription('API documentation for suplymap backend')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  await app.listen(PORT, '0.0.0.0');

  const url = await app.getUrl();


  logger.log('======================================');
  logger.log('✅ APPLICATION STARTED SUCCESSFULLY');
  logger.log('======================================');
  logger.log(`🚀 Server running at: ${url}/api/v1`);
  logger.log(`📘 Swagger docs: ${url}/api`);
  logger.log('======================================');
}

bootstrap();