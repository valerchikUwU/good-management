import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Objective } from "src/domains/objective.entity";
import { ObjectiveService } from "../services/objective/objective.service";
import { ObjectiveRepository } from "../services/objective/repository/objective.repository";
import { ObjectiveController } from "src/controllers/objective.controller";
import { UsersModule } from "./users.module";
import { StrategyModule } from "./strategy.module";
import { OrganizationModule } from "./organization.module";


@Module({
    imports: [TypeOrmModule.forFeature([Objective]), UsersModule, StrategyModule],
    controllers: [ObjectiveController],
    providers: [ObjectiveService, ObjectiveRepository]
})
export class ObjectiveModule{}