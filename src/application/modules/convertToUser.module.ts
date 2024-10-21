import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConvertToUser } from "src/domains/convertToUser.entity";
import { UsersModule } from "./users.module";
import { ConvertToUserService } from "../services/convertToUser/convertToUser.service";
import { ConvertToUserRepository } from "../services/convertToUser/repository/convertToUser.repository";


@Module({
    imports: [TypeOrmModule.forFeature([ConvertToUser]), UsersModule],
    providers: [ConvertToUserService, ConvertToUserRepository],
    exports: [ConvertToUserService]
})
export class ConvertToUserModule{}