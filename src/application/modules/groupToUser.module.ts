import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersModule } from "./users.module";
import { GroupToUser } from "src/domains/groupToUser.entity";
import { GroupToUserService } from "../services/groupToUser/groupToUser.service";
import { GroupToUserRepository } from "../services/groupToUser/repository/groupToUser.repository";


@Module({
    imports: [TypeOrmModule.forFeature([GroupToUser]), UsersModule],
    providers: [GroupToUserService, GroupToUserRepository],
    exports: [GroupToUserService]
})
export class GroupToUserModule{}