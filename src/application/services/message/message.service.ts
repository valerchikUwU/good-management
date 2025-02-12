import {
  BadRequestException,
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

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: MessageRepository,
    private readonly attachmentToMessageService: AttachmentToMessageService,
    @Inject('winston') private readonly logger: Logger,
  ) {}

  async findAllForConvert(convertId: string): Promise<MessageReadDto[]> {
    const messages = await this.messageRepository.find({
      where: { convert: { id: convertId } },
    });
    return messages.map((message) => ({
      id: message.id,
      content: message.content,
      convert: message.convert,
      sender: message.sender,
    }));
  }

  async create(messageCreateDto: MessageCreateDto): Promise<Message> {
    try {
      const createdMessage = await this.messageRepository.save(messageCreateDto);
      if(messageCreateDto.attachmentIds){
        await this.attachmentToMessageService.createSeveral(createdMessage, messageCreateDto.attachmentIds);
      }
      return createdMessage;
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException('Ошибка при создании сообщения');
    }
  }

  async update(
    _id: string,
    messageUpdateDto: MessageUpdateDto,
  ): Promise<Message> {
    try {
      const message = await this.messageRepository.findOne({
        where: { id: _id },
      });
      if (!message) {
        throw new NotFoundException(`Сообщение с ID ${_id} не найден`);
      }
      if (messageUpdateDto.content) message.content = messageUpdateDto.content;
      return await this.messageRepository.save(message);
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
