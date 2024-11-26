import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GlobalErrorInterceptor } from './common/interceptors/error.interceptor';
import { AuthInterceptor } from './common/interceptors/auth.interceptor';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    transformOptions: {
      enableImplicitConversion: true,
    },
  }));

  app.useGlobalInterceptors(
    new GlobalErrorInterceptor(),
    app.get(AuthInterceptor),
  );

  app.setGlobalPrefix('api/v1');
  app.enableCors();
  
  await app.listen(process.env.PORT || 8080, () => {
    console.log(
      `Server is running on http://localhost:${process.env.PORT || 8080}`,
    );
  });
}
bootstrap();
