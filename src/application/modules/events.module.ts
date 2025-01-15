import { Module } from '@nestjs/common';
import { ConvertGateway } from 'src/gateways/convert.gateway';
import { EventsGateway } from 'src/gateways/events.gateway';
import { MessageModule } from './message.module';
import { ConvertModule } from './convert.module';
import { PostModule } from './post.module';

@Module({
  imports: [ConvertModule],
  providers: [EventsGateway, ConvertGateway],
  exports: [EventsGateway, ConvertGateway],
})
export class EventsModule {}
