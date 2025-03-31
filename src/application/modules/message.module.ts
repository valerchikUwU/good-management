import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from 'src/domains/message.entity';
import { MessageService } from '../services/message/message.service';
import { MessageRepository } from '../services/message/repository/message.repository';
import { AttachmentToMessageModule } from './attachmentToMessage.module';
import { MessageController } from 'src/controllers/message.controller';
import { EventsModule } from './events.module';
import { ConvertModule } from './convert.module';
import { WatchersToConvertModule } from './watchersToConvert.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Message]),
    AttachmentToMessageModule,
    forwardRef(() => EventsModule),
    ConvertModule,
    WatchersToConvertModule
  ],
  providers: [MessageService, MessageRepository],
  controllers: [MessageController],
  exports: [MessageService],
})
export class MessageModule { }
