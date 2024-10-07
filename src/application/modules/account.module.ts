import { Module } from "@nestjs/common";
import { AccountService } from "../services/account/account.service";
import { AccountRepository } from "../services/account/repository/account.repository";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Account } from "src/domains/account.entity";
import { AccountController } from "src/controllers/account.controller";
import { UsersModule } from "./users.module";
import { ClientsModule } from "@nestjs/microservices";
import { rabbitmqConfig } from "src/config/rabbitmq.config";

@Module({
    imports: [TypeOrmModule.forFeature([Account]),
    ClientsModule.register([
      {
        name: 'RABBITMQ_SERVICE',
        ...rabbitmqConfig(),
      },
    ]),
        UsersModule],
    controllers: [AccountController],
    providers: [AccountService, AccountRepository],
    exports: [AccountService]

})
export class AccountModule { }