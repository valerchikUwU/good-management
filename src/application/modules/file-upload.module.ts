import { Module } from '@nestjs/common';
import { FileUploadController } from '../../controllers/file-upload.controller';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { FileModule } from './file.module';
import { AttachmentModule } from './attachment.module';

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          // Генерация имени файла
          const filename = `${Date.now()}-${file.originalname}`;
          cb(null, filename);
        },
      }),
    }),
    FileModule,
    AttachmentModule
  ],
  controllers: [FileUploadController],
})
export class FileUploadModule {}
