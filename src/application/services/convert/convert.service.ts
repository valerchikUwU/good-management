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
import { ConvertToUserService } from '../convertToUser/convertToUser.service';
import { ConvertUpdateDto } from 'src/contracts/convert/update-convert.dto';

@Injectable()
export class ConvertService {
  constructor(
    @InjectRepository(Convert)
    private readonly convertRepository: ConvertRepository,
    private readonly convertToUserService: ConvertToUserService,
    @Inject('winston') private readonly logger: Logger,
  ) {}

  async findAll(account: AccountReadDto): Promise<ConvertReadDto[]> {
    const converts = await this.convertRepository.find({
      where: { account: { id: account.id } },
    });
    return converts.map((convert) => ({
      id: convert.id,
      convertTheme: convert.convertTheme,
      pathOfPosts: convert.pathOfPosts,
      expirationTime: convert.expirationTime,
      convertType: convert.convertType,
      activeUserId: convert.activeUserId,
      dateFinish: convert.dateFinish,
      createdAt: convert.createdAt,
      messages: convert.messages,
      convertToUsers: convert.convertToUsers,
      host: convert.host,
      account: convert.account,
    }));
  }

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
        activeUserId: convert.activeUserId,
        dateFinish: convert.dateFinish,
        createdAt: convert.createdAt,
        messages: convert.messages,
        convertToUsers: convert.convertToUsers,
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
      // Проверка на наличие обязательных данных
      if (!convertCreateDto.convertTheme) {
        throw new BadRequestException('Тема не может быть пустой!');
      }
      const convert = new Convert();
      convert.convertTheme = convertCreateDto.convertTheme;
      convert.pathOfPosts = convertCreateDto.pathOfPosts;
      convert.expirationTime = convertCreateDto.expirationTime;
      convert.convertType = convertCreateDto.convertType;
      convert.dateFinish = convertCreateDto.dateFinish;
      convert.host = convertCreateDto.host;
      convert.account = convertCreateDto.account;
      const createdConvert = await this.convertRepository.save(convert);
      await this.convertToUserService.createSeveral(
        createdConvert,
        convertCreateDto.userIds,
      );
      return createdConvert;
    } catch (err) {
      this.logger.error(err);
      // Обработка специфичных исключений
      if (err instanceof BadRequestException) {
        throw err; // Пробрасываем исключение дальше
      }
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
      if (convertUpdateDto.pathOfPosts) {
        convert.pathOfPosts = convertUpdateDto.pathOfPosts;
      }
      if (convertUpdateDto.activeUserId) {
        convert.activeUserId = convertUpdateDto.activeUserId;
      }
      if (convertUpdateDto.userIds) {
        await this.convertToUserService.remove(convert);
        await this.convertToUserService.createSeveral(
          convert,
          convertUpdateDto.userIds,
        );
      }
      await this.convertRepository.update(convert.id, {
        pathOfPosts: convert.pathOfPosts,
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
