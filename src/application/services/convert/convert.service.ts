import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Convert } from 'src/domains/convert.entity';
import { ConvertRepository } from './repository/convert.repository';
import { ConvertReadDto } from 'src/contracts/convert/read-convert.dto';
import { Logger } from 'winston';
import { ConvertCreateDto } from 'src/contracts/convert/create-convert.dto';
import { ConvertToPostService } from '../convertToPost/convertToPost.service';
import { ConvertUpdateDto } from 'src/contracts/convert/update-convert.dto';
import { WatchersToConvertService } from '../watchersToConvert/watchersToConvert.service';

@Injectable()
export class ConvertService {
  constructor(
    @InjectRepository(Convert)
    private readonly convertRepository: ConvertRepository,
    private readonly convertToPostService: ConvertToPostService,
    private readonly watchersToConvertService: WatchersToConvertService,
    @Inject('winston') private readonly logger: Logger,
  ) { }



  async findAllForContact(userPostsIds: string[], contactId: string): Promise<any[]> {
    try {
      const converts = await this.convertRepository
        .createQueryBuilder('convert')
        .innerJoin('convert.convertToPosts', 'convertToPost')
        .innerJoin('convertToPost.post', 'post')
        .leftJoin(
          'convert.messages',
          'unreadMessages',
          `NOT EXISTS (
          SELECT 1 FROM "message_seen_status" "mrs"
          WHERE "mrs"."messageId" = "unreadMessages"."id"
          AND "mrs"."postId" IN (:...userPostsIds)
        ) 
        AND "unreadMessages"."senderId" NOT IN (:...userPostsIds)`
        )
        .leftJoin(
          'c.messages',
          'latestMessage',
          '"latestMessage"."messageNumber" = (SELECT MAX("m"."messageNumber") FROM "message" "m" WHERE "m"."convertId" = "convert"."id")'
        )
        .where('post.id IN (:...userPostsIds)', { userPostsIds })
        .andWhere(`EXISTS (
        SELECT 1 FROM "convert_to_post" "sub_ctp"
        INNER JOIN "post" "sub_post" ON "sub_ctp"."postId" = "sub_post"."id"
        WHERE "sub_ctp"."convertId" = "convert"."id"
        AND "sub_post"."id" = :contactId
      )`, { contactId })
        .select([
          'convert.*',
          '"latestMessage"."content" AS "latestMessageContent"',
          '"latestMessage"."createdAt" AS "latestMessageCreatedAt"',
          'COUNT("unreadMessages"."id") AS "unseenMessagesCount"',
        ])
        .groupBy('convert.id , "latestMessage"."content", "latestMessage"."createdAt"')
        .getRawMany();
      return converts;
    } catch (err) {
      this.logger.error(err);
      if (err instanceof NotFoundException) {
        throw err;
      }

      throw new InternalServerErrorException('Ошибка при получении конверта');
    }
  }


  async findAllCopiesForContact(userPostsIds: string[], contactId: string): Promise<any[]> {
    try {
      const converts = await this.convertRepository
        .createQueryBuilder('convert')
        .innerJoin('convert.convertToPosts', 'convertToPost')
        .innerJoin('convertToPost.post', 'post')
        .leftJoinAndSelect('convert.watchersToConvert', 'wtc')
        .leftJoin('wtc.post', 'watcher')
        .where('watcher.id IN (:...userPostsIds)', { userPostsIds })
        .andWhere(`EXISTS (
        SELECT 1 FROM "convert_to_post" "sub_ctp"
        INNER JOIN "post" "sub_post" ON "sub_ctp"."postId" = "sub_post"."id"
        WHERE "sub_ctp"."convertId" = "convert"."id"
        AND "sub_post"."id" = :contactId
      )`, { contactId })
        .getMany();
      return converts;
    } catch (err) {
      this.logger.error(err);
      if (err instanceof NotFoundException) {
        throw err;
      }

      throw new InternalServerErrorException('Ошибка при получении конверта');
    }
  }




  async findOneById(id: string, relations?: string[]): Promise<ConvertReadDto> {
    try {
      const convert = await this.convertRepository.findOne({
        where: { id: id },
        relations: relations ?? [],
      });

      if (!convert) throw new NotFoundException(`Конверт с ID: ${id} не найдена!`);
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
        target: convert.target,
        watchersToConvert: convert.watchersToConvert
      };
      return convertReadDto;
    } catch (err) {
      this.logger.error(err);
      if (err instanceof NotFoundException) {
        throw err;
      }

      throw new InternalServerErrorException('Ошибка при получении конверта');
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
      await Promise.all([
        convertCreateDto.watcherIds !== undefined ? this.watchersToConvertService.createSeveral(createdConvert, convertCreateDto.watcherIds) : null,
        this.convertToPostService.createSeveral(createdConvert, convertCreateDto.pathOfPosts.slice(0, 2))
      ])
      return createdConvert;
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException('Ошибка при создании конверта');
    }
  }

  async update(_id: string, convertUpdateDto: ConvertUpdateDto): Promise<string> {
    try {
      const convert = await this.convertRepository.findOne({
        where: { id: _id },
      });
      if (!convert) {
        throw new NotFoundException(`Конверт с ID ${_id} не найден`);
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
      throw new InternalServerErrorException('Ошибка при обновлении конверта');
    }
  }
}
