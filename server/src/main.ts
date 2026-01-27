import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3030;

  // CORS 설정 활성화 (React Native에서 접근 가능하도록)
  app.enableCors({
    origin: true, // 모든 origin 허용 (개발 환경)
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  await app.listen(port, '0.0.0.0');
  console.log(`🚀 서버가 포트 ${port}에서 실행중입니다.`);
}
bootstrap();
