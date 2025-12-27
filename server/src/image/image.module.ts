import { Module } from '@nestjs/common';
import { ImageController } from './image.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Image } from './image.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Image])],
    controllers: [ImageController],
})
export class ImageModule {}
