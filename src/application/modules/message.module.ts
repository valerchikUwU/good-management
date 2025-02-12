import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from 'src/domains/message.entity';
import { MessageService } from '../services/message/message.service';
import { MessageRepository } from '../services/message/repository/message.repository';
import { AttachmentToMessageModule } from './attachmentToMessage.module';

@Module({
  imports: [TypeOrmModule.forFeature([Message]), AttachmentToMessageModule],
  providers: [MessageService, MessageRepository],
  exports: [MessageService],
})
export class MessageModule {}
