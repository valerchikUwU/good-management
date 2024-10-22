import { Module } from "@nestjs/common";
import { ConvertGateway } from "src/gateways/convert.gateway";
import { EventsGateway } from "src/gateways/events.gateway";

@Module({
    providers: [EventsGateway, ConvertGateway],
    exports: [EventsGateway, ConvertGateway]
  })
  export class EventsModule {}