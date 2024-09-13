import { Module } from "@nestjs/common";
import { EventsGateway } from "src/gateways/events.gateway";

@Module({
    providers: [EventsGateway],
    exports: [EventsGateway]
  })
  export class EventsModule {}