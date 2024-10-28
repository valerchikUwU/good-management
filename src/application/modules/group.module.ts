import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersModule } from "./users.module";
import { GroupService } from "../services/group/group.service";
import { GroupRepository } from "../services/group/repository/group.repository";
import { Group } from "src/domains/group.entity";
import { GroupToUserModule } from "./groupToUser.module";
import { GroupController } from "src/controllers/group.controller";
import { OrganizationModule } from "./organization.module";



@Module({
    imports: [
        TypeOrmModule.forFeature([Group]),
        UsersModule,
        GroupToUserModule,
        OrganizationModule
    ],
    controllers: [GroupController],
    providers: [GroupService, GroupRepository],
    exports: [GroupService]
})
export class GroupModule { }