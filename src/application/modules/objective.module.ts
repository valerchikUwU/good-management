import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Objective } from "src/domains/objective.entity";
import { ObjectiveService } from "../services/objective/objective.service";
import { ObjectiveRepository } from "../services/objective/repository/objective.repository";
import { ObjectiveToOrganizationModule } from "./objectiveToOrganization.module";
import { ObjectiveController } from "src/controllers/objective.controller";


@Module({
    imports: [TypeOrmModule.forFeature([Objective]), ObjectiveToOrganizationModule],
    controllers: [ObjectiveController],
    providers: [ObjectiveService, ObjectiveRepository]
})
export class ObjectiveModule{}