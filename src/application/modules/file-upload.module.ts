import { Module } from '@nestjs/common';
import { FileUploadService } from '../services/file-upload/file-upload.service';
import { FileUploadController } from '../../controllers/file-upload.controller';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import path from 'path';
import { FileModule } from './file.module';

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const date = new Date();
          // Генерация имени файла
          const filename = `${Date.now()}-${file.originalname}`;
          cb(null, filename);
        },
      }),
    }),
    FileModule,
  ],
  controllers: [FileUploadController],
  providers: [FileUploadService],
})
export class FileUploadModule {}
