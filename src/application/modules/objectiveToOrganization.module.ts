import { Module } from "@nestjs/common";
import { OrganizationModule } from "./organization.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ObjectiveToOrganization } from "src/domains/objectiveToOrganization.entity";
import { ObjectiveToOrganizationService } from "../services/objectiveToOrganization/objectiveToOrganization.service";
import { ObjectiveToOrganizationRepository } from "../services/objectiveToOrganization/repository/objectiveToOrganization.repository";


@Module({
    imports: [TypeOrmModule.forFeature([ObjectiveToOrganization]), OrganizationModule],
    providers: [ObjectiveToOrganizationService, ObjectiveToOrganizationRepository],
    exports: [ObjectiveToOrganizationService]
})
export class ObjectiveToOrganizationModule{}