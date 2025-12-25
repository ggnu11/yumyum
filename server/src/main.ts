import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3030;

  // CORS 설정 활성화
  await app.listen(port, '0.0.0.0');
  console.log(`🚀 서버가 포트 ${port}에서 실행중입니다.`);
}
bootstrap();
