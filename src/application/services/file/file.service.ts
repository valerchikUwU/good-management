import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { File } from 'src/domains/file.entity';
import { FileRepository } from './repository/file.repository';
import { Logger } from 'winston';
import { PolicyReadDto } from 'src/contracts/policy/read-policy.dto';
import { FileReadDto } from 'src/contracts/file-upload/read-file.dto';
import { FileCreateDto } from 'src/contracts/file-upload/create-file.dto';

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(File)
    private readonly fileRepository: FileRepository,
    @Inject('winston') private readonly logger: Logger,
  ) {}

  async findAllForPolicy(policy: PolicyReadDto): Promise<FileReadDto[]> {
    try {
      const files = await this.fileRepository.find({
        where: { policy: { id: policy.id } },
      });
      return files.map((file) => ({
        id: file.id,
        fileName: file.fileName,
        path: file.path,
        size: file.size,
        mimetype: file.mimetype,
        createdAt: file.createdAt,
        updatedAt: file.updatedAt,
      }));
    } catch (err) {
      this.logger.error(err);
      // Обработка других ошибок
      throw new InternalServerErrorException(
        'Ошибка при получении всех файлов!',
      );
    }
  }

  async create(fileCreateDto: FileCreateDto): Promise<File> {
    try {
      // Проверка на наличие обязательных данных
      if (!fileCreateDto.fileName) {
        throw new BadRequestException('У файла обязательно наличие названия!');
      }
      if (!fileCreateDto.path) {
        throw new BadRequestException('У файла обязательно наличие пути!');
      }
      if (!fileCreateDto.size) {
        throw new BadRequestException('У файла обязательно наличие размера!');
      }
      if (!fileCreateDto.mimetype) {
        throw new BadRequestException(
          'У файла обязательно наличие расширения!',
        );
      }
      const file = new File();
      file.fileName = fileCreateDto.fileName;
      file.path = fileCreateDto.path;
      file.size = fileCreateDto.size;
      file.mimetype = fileCreateDto.mimetype;
      file.policy = fileCreateDto.policy;

      return await this.fileRepository.save(file);
    } catch (err) {
      this.logger.error(err);
      if (err instanceof BadRequestException) {
        throw err;
      }

      throw new InternalServerErrorException('Ошибка при создании файла!');
    }
  }
}
