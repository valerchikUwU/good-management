import { PipeTransform, Injectable, BadRequestException, ArgumentMetadata, Inject } from '@nestjs/common';

@Injectable()
export class FileValidationPipe implements PipeTransform {
    transform(file: Express.Multer.File, metadata: ArgumentMetadata) {
        if (!file) {
            throw new BadRequestException('Файл не загружен');
        }
        if (file.size > 1024 * 1024 * 1024 * 2) {
            throw new BadRequestException('Размер файла превышает 2 GB');
        }
        const allowedMimeTypes = [
            'image/jpeg', 
            'image/png', 
            'image/gif', 
            'image/webp', 
            'image/jpg', 
            'application/pdf', 
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 
            'video/mp4', 
            'application/vnd.openxmlformats-officedocument.presentationml.presentation', 
            'application/vnd.ms-powerpoint', 
            'text/plain', 
            'application/vnd.ms-excel', 
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        ];
        if (!allowedMimeTypes.includes(file.mimetype)) {
            throw new BadRequestException('Недопустимый тип файла');
        }
        return file;
    }
}