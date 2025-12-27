import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.SERVER_PORT || 3030;
  const isProduction = process.env.NODE_ENV === 'production';
  // CORS 설정 활성화
  if (process.env.NODE_ENV === 'production') {
    console.log('Is production:', isProduction);
    app.enableCors({
      origin: ['https://...'],
      credentials: true,
    });
  } else {
    app.enableCors({
      origin: true,
      credentials: true,
    });
  }

  await app.listen(port, '0.0.0.0');
  console.log(`🚀 서버가 포트 ${port}에서 실행중입니다.`);
}
bootstrap();
