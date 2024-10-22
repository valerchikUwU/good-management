import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Convert } from "src/domains/convert.entity";
import { ConvertService } from "../services/convert/convert.service";
import { ConvertRepository } from "../services/convert/repository/convert.repository";
import { ConvertToUserModule } from "./convertToUser.module";
import { ConvertController } from "src/controllers/convert.controller";
import { UsersModule } from "./users.module";


@Module({
    imports: [TypeOrmModule.forFeature([Convert]), ConvertToUserModule, UsersModule],
    controllers: [ConvertController],
    providers: [ConvertService, ConvertRepository],
    exports: [ConvertService]
})
export class ConvertModule{}