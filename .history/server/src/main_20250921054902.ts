import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.SERVER_PORT || 3030;

  // CORS 설정 활성화
  if (process.env.NODE_ENV === 'production') {
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

const config = new DocumentBuilder()
    .setTitle('My API')
    .setDescription('API documentation')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // Swagger UI available at /api


  await app.listen(port, '0.0.0.0');
  console.log(`🚀 서버가 포트 ${port}에서 실행중입니다.`);
}
bootstrap();
