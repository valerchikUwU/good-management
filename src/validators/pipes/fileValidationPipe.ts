import { PipeTransform, Injectable, BadRequestException, ArgumentMetadata, Inject } from '@nestjs/common';

@Injectable()
export class FileValidationPipe implements PipeTransform {
  transform(file: Express.Multer.File, metadata: ArgumentMetadata) {
    if (!file) {
      throw new BadRequestException('Файл не загружен');
    }
    if (file.size > 1024 * 1024 * 5) {
      throw new BadRequestException('Размер файла превышает 5 MB');
    }
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('Недопустимый тип файла');
    }
    return file;
  }
}