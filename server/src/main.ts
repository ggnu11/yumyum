import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3030, '0.0.0.0'); // 👈 '0.0.0.0' 추가
  console.log(`Server running on http://0.0.0.0:3030`);
  console.log(`Access from devices: http://10.100.9.20:3030`); // 👈 실제 접근 주소 표시
}
bootstrap();
