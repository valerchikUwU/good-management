import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Logger } from 'winston';
import { MessageRepository } from './repository/message.repository';
import { Message } from 'src/domains/message.entity';
import { MessageReadDto } from 'src/contracts/message/read-message.dto';
import { MessageCreateDto } from 'src/contracts/message/create-message.dto';
import { MessageUpdateDto } from 'src/contracts/message/update-message.dto';
import { AttachmentToMessageService } from '../attachmentToMessage/attachmentToMessage.service';
import { In, IsNull, Not } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import Redis from 'ioredis';
import { InjectRedis } from '@nestjs-modules/ioredis';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: MessageRepository,
    private readonly attachmentToMessageService: AttachmentToMessageService,
    @InjectRedis()
    private readonly redis: Redis,
    @Inject(CACHE_MANAGER)
    private readonly cacheService: Cache,
    @Inject('winston') private readonly logger: Logger,
  ) { }

  async findSeenAndUsersForConvert(convertId: string, pagination: number, userPostIds: string[], relations?: string[]): Promise<MessageReadDto[]> {
    try {
      const cachedMessages = await this.cacheService.get<Message[]>(`messages:${convertId}:${pagination}:seen`)
      const messages = cachedMessages ??
        await this.messageRepository.find({
          where: [
            {
              convert: { id: convertId },
              timeSeen: Not(IsNull())
            },
            {
              convert: { id: convertId },
              sender: {id: In(userPostIds)}
            }
          ],
          relations: relations !== undefined ? relations : [],
          order: {
            createdAt: 'DESC'
          },
          take: 30,
          skip: pagination
        });
      if (!cachedMessages && messages.length !== 0) {
        await this.cacheService.set<Message[]>(`messages:${convertId}:${pagination}:seen`, messages, 1860000);
      }

      return messages.map((message) => ({
        id: message.id,
        content: message.content,
        timeSeen: message.timeSeen,
        createdAt: message.createdAt,
        updatedAt: message.updatedAt,
        convert: message.convert,
        sender: message.sender,
        attachmentToMessage: message.attachmentToMessages,
      }));
    }
    catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException('Ошибка при получении прочитанных сообщений в конверте');
    }
  }

  async findUnseenForConvert(convertId: string, pagination: number, userPostIds: string[], relations?: string[]): Promise<MessageReadDto[]> {
    try {
      const cachedMessages = await this.cacheService.get<Message[]>(`messages:${convertId}:${pagination}:unseen`)
      const messages = cachedMessages ??
        await this.messageRepository.find({
          where: [
            {
              convert: { id: convertId },
              timeSeen: IsNull()
            },
            {
              convert: { id: convertId },
              sender: {id: Not(In(userPostIds))}
            }
          ],
          relations: relations !== undefined ? relations : [],
          order: {
            createdAt: 'DESC'
          },
          take: 30,
          skip: pagination
        });
      if (!cachedMessages && messages.length !== 0) {
        await this.cacheService.set<Message[]>(`messages:${convertId}:${pagination}:unseen`, messages, 1860000);
      }

      return messages.map((message) => ({
        id: message.id,
        content: message.content,
        timeSeen: message.timeSeen,
        createdAt: message.createdAt,
        updatedAt: message.updatedAt,
        convert: message.convert,
        sender: message.sender,
        attachmentToMessage: message.attachmentToMessages,
      }));
    }
    catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException('Ошибка при получении прочитанных сообщений в конверте');
    }
  }

  async findCountOfUnseenForConvert(convertId: string): Promise<number> {
    try {
      const messages = await this.messageRepository.count({
        where: { convert: { id: convertId }, timeSeen: IsNull() },
      });
      return messages
    }
    catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException('Ошибка при получении кол-ва непрочитанных сообщений в конверте');
    }
  }

  async create(messageCreateDto: MessageCreateDto): Promise<Message> {
    try {
      const createdMessage = await this.messageRepository.save(messageCreateDto);
      if (messageCreateDto.attachmentIds) {
        await this.attachmentToMessageService.createSeveral(createdMessage, messageCreateDto.attachmentIds);
      }
      // Используем pipeline для выполнения удаления всех ключей одним запросом
      this.redis.keys(`undefined:messages:${messageCreateDto.convert.id}:*`).then((keys) => {
        let pipeline = this.redis.pipeline();
        pipeline.unlink(keys)
        return pipeline.exec();
      });

      return createdMessage;
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException('Ошибка при создании сообщения');
    }
  }

  async update(
    _id: string,
    messageUpdateDto: MessageUpdateDto,
  ): Promise<string> {
    try {
      const message = await this.messageRepository.findOne({
        where: { id: _id },
        relations: ['convert']
      });
      if (!message) {
        throw new NotFoundException(`Сообщение с ID ${_id} не найден`);
      }
      if (messageUpdateDto.content) message.content = messageUpdateDto.content;
      if (messageUpdateDto.timeSeen) message.timeSeen = new Date();
      await this.messageRepository.update(_id, { content: message.content, timeSeen: message.timeSeen });

      // Используем pipeline для выполнения удаления всех ключей одним запросом
      this.redis.keys(`undefined:messages:${message.convert.id}:*`).then((keys) => {
        let pipeline = this.redis.pipeline();
        pipeline.unlink(keys)
        return pipeline.exec();
      });

      return _id
    } catch (err) {
      this.logger.error(err);
      // Обработка специфичных исключений
      if (err instanceof NotFoundException) {
        throw err; // Пробрасываем исключение дальше
      }

      // Обработка других ошибок
      throw new InternalServerErrorException('Ошибка при обновлении сообщения');
    }
  }
}
