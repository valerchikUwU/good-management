import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Convert } from 'src/domains/convert.entity';
import { ConvertRepository } from './repository/convert.repository';
import { AccountReadDto } from 'src/contracts/account/read-account.dto';
import { ConvertReadDto } from 'src/contracts/convert/read-convert.dto';
import { Logger } from 'winston';
import { ConvertCreateDto } from 'src/contracts/convert/create-convert.dto';
import { ConvertToPostService } from '../convertToPost/convertToPost.service';
import { ConvertUpdateDto } from 'src/contracts/convert/update-convert.dto';
import { In } from 'typeorm';

@Injectable()
export class ConvertService {
  constructor(
    @InjectRepository(Convert)
    private readonly convertRepository: ConvertRepository,
    private readonly convertToPostService: ConvertToPostService,
    @Inject('winston') private readonly logger: Logger,
  ) { }



  async findOneById(id: string, relations?: string[]): Promise<ConvertReadDto> {
    try {
      const convert = await this.convertRepository.findOne({
        where: { id: id },
        relations: relations !== undefined ? relations : [],
      });

      if (!convert) throw new NotFoundException(`Чат с ID: ${id} не найдена!`);
      const convertReadDto: ConvertReadDto = {
        id: convert.id,
        convertTheme: convert.convertTheme,
        pathOfPosts: convert.pathOfPosts,
        expirationTime: convert.expirationTime,
        convertType: convert.convertType,
        convertPath: convert.convertPath,
        convertStatus: convert.convertStatus,
        activePostId: convert.activePostId,
        dateFinish: convert.dateFinish,
        createdAt: convert.createdAt,
        messages: convert.messages,
        convertToPosts: convert.convertToPosts,
        host: convert.host,
        account: convert.account,
      };
      return convertReadDto;
    } catch (err) {
      this.logger.error(err);
      // Обработка специфичных исключений
      if (err instanceof NotFoundException) {
        throw err; // Пробрасываем исключение дальше
      }

      // Обработка других ошибок
      throw new InternalServerErrorException('Ошибка при получении чата');
    }
  }

  async create(convertCreateDto: ConvertCreateDto): Promise<ConvertReadDto> {
    try {
      const convert = new Convert();
      convert.convertTheme = convertCreateDto.convertTheme;
      convert.pathOfPosts = convertCreateDto.pathOfPosts;
      convert.expirationTime = convertCreateDto.expirationTime;
      convert.convertType = convertCreateDto.convertType;
      convert.convertPath = convertCreateDto.convertPath;
      convert.activePostId = convertCreateDto.pathOfPosts[1];
      convert.dateFinish = convertCreateDto.dateFinish;
      convert.host = convertCreateDto.host;
      convert.account = convertCreateDto.account;
      const createdConvert = await this.convertRepository.save(convert);
      await this.convertToPostService.createSeveral(
        createdConvert,
        convertCreateDto.pathOfPosts.slice(0, 2),
      );
      return createdConvert;
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException('Ошибка при создании чата');
    }
  }

  async update(_id: string, convertUpdateDto: ConvertUpdateDto): Promise<string> {
    try {
      const convert = await this.convertRepository.findOne({
        where: { id: _id },
      });
      if (!convert) {
        throw new NotFoundException(`Чат с ID ${_id} не найден`);
      }
      if (convertUpdateDto.activePostId) {
        convert.activePostId = convertUpdateDto.activePostId;
      }
      if (convertUpdateDto.convertStatus) {
        convert.convertStatus = convertUpdateDto.convertStatus;
      }
      if (convertUpdateDto.convertToPostIds) {
        await this.convertToPostService.remove(convert);
        await this.convertToPostService.createSeveral(
          convert,
          convertUpdateDto.convertToPostIds,
        );
      }
      await this.convertRepository.update(convert.id, {
        activePostId: convert.activePostId,
        convertStatus: convert.convertStatus
      });
      return convert.id;
    } catch (err) {
      this.logger.error(err);
      // Обработка специфичных исключений
      if (err instanceof NotFoundException) {
        throw err; // Пробрасываем исключение дальше
      }

      // Обработка других ошибок
      throw new InternalServerErrorException('Ошибка при обновлении чата');
    }
  }
}
