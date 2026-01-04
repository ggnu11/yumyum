import {
  Controller,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FilesInterceptor } from '@nestjs/platform-express';
import { createClient } from '@supabase/supabase-js';
import { numbers } from 'src/@common/contants';
import { getUniqueFileName } from 'src/@common/utils';

@Controller('images')
@UseGuards(AuthGuard())
export class ImageController {
  private supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
  );

  @UseInterceptors(
    FilesInterceptor('images', numbers.MAX_IMAGE_COUNT, {
      limits: { fileSize: numbers.MAX_IAMGE_SIZE },
    }),
  )
  @Post('/')
  async uploadImages(@UploadedFiles() files: Express.Multer.File[]) {
    const bucketName = process.env.SUPABASE_BUCKET_NAME || 'images';
    const uuid = Date.now();

    const uploadPromises = files.map(async (file) => {
      const fileName = getUniqueFileName(file, uuid);
      const filePath = `original/${fileName}`;

      const { error } = await this.supabase.storage
        .from(bucketName)
        .upload(filePath, file.buffer, {
          contentType: file.mimetype,
          upsert: false,
        });

      if (error) {
        throw new Error(`Failed to upload image: ${error.message}`);
      }

      return filePath;
    });

    const filePaths = await Promise.all(uploadPromises);

    // Public URL 생성
    const uris = filePaths.map((filePath) => {
      const {
        data: { publicUrl },
      } = this.supabase.storage.from(bucketName).getPublicUrl(filePath);

      return publicUrl;
    });

    return uris;
  }
}
