import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { GoalToOrganization } from "src/domains/goalToOrganization.entity";
import { GoalToOrganizationService } from "../services/goalToOrganization/goalToOrganization.service";
import { GoalToOrganizationRepository } from "../services/goalToOrganization/repository/goalToOrganization.repository";
import { OrganizationModule } from "./organization.module";


@Module({
    imports: [TypeOrmModule.forFeature([GoalToOrganization]), OrganizationModule],
    providers: [GoalToOrganizationService, GoalToOrganizationRepository],
    exports: [GoalToOrganizationService]
})
export class GoalToOrganizationModule{}