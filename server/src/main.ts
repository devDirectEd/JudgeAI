import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GlobalErrorInterceptor } from './common/interceptors/error.interceptor';
import { AuthInterceptor } from './common/interceptors/auth.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(
    new GlobalErrorInterceptor(),
    app.get(AuthInterceptor),
  );
  await app.listen(process.env.PORT || 8080);
}
bootstrap();
