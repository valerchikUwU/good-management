import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Message } from "src/domains/message.entity";
import { MessageService } from "../services/message/message.service";
import { MessageRepository } from "../services/message/repository/message.repository";


@Module({
    imports: [TypeOrmModule.forFeature([Message])],
    providers: [MessageService, MessageRepository],
    exports: [MessageService]
})
export class MessageModule{}