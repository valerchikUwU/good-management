import { forwardRef, Module } from '@nestjs/common';
import { ConvertGateway } from 'src/gateways/convert.gateway';
import { EventsGateway } from 'src/gateways/events.gateway';
import { ConvertModule } from './convert.module';
import { MessageModule } from './message.module';

@Module({
  imports: [MessageModule],
  providers: [EventsGateway, ConvertGateway],
  exports: [EventsGateway, ConvertGateway],
})
export class EventsModule {}
