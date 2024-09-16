import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Goal } from "src/domains/goal.entity";
import { GoalService } from "../services/goal/goal.service";
import { GoalRepository } from "../services/goal/repository/goal.repository";
import { GoalController } from "src/controllers/goal.controller";
import { GoalToOrganizationModule } from "./goalToOrganization.module";


@Module({
    imports: [TypeOrmModule.forFeature([Goal]), GoalToOrganizationModule],
    controllers: [GoalController],
    providers: [GoalService, GoalRepository]
})
export class GoalModule{}