import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Project } from "src/domains/project.entity";
import { ProjectToOrganizationModule } from "./projectToOrganization.module";
import { ProjectService } from "../services/project/project.service";
import { ProjectRepository } from "../services/project/repository/project.repository";
import { ProjectController } from "src/controllers/project.controller";
import { UsersModule } from "./users.module";
import { StrategyModule } from "./strategy.module";
import { TargetModule } from "./target.module";
import { OrganizationModule } from "./organization.module";


@Module({
    imports: [TypeOrmModule.forFeature([Project]),
    ProjectToOrganizationModule, UsersModule, StrategyModule, TargetModule, OrganizationModule],
    controllers: [ProjectController],
    providers: [ProjectService, ProjectRepository]
})
export class ProjectModule{}