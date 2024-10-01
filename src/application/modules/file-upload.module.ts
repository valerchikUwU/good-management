import { Module } from '@nestjs/common';
import { FileUploadService } from '../services/file-upload/file-upload.service';
import { FileUploadController } from '../../controllers/file-upload.controller';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import path from 'path';
import { FileModule } from './file.module';
import { PolicyModule } from './policy.module';

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const date = new Date();
          // Генерация имени файла
          const extname = path.extname(file.originalname).toLowerCase();
          const originalName = path.basename(file.originalname, path.extname(file.originalname));
          const uniqueSuffix = date.toLocaleDateString() + "-" + Math.round(Math.random() * 1e9);
          const newFilename = `${originalName}-${uniqueSuffix}${extname}`;
          cb(null, newFilename);
        },
      }),
    }),
    FileModule, PolicyModule
  ],
  controllers: [FileUploadController],
  providers: [FileUploadService],
})
export class FileUploadModule {}
