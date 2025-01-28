import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttachmentToMessage } from 'src/domains/attachmentToMessage.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AttachmentToMessage])],
})
export class AttachmentToMessageModule {}
