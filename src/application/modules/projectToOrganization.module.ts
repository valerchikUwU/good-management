import { Module } from "@nestjs/common";
import { OrganizationModule } from "./organization.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProjectToOrganization } from "src/domains/projectToOrganization.entity";
import { ProjectToOrganizationService } from "../services/projectToOrganization/projectToOrganization.service";
import { ProjectToOrganizationRepository } from "../services/projectToOrganization/repository/projectToOrganization.repository";


@Module({
    imports: [TypeOrmModule.forFeature([ProjectToOrganization]), OrganizationModule],
    providers: [ProjectToOrganizationService, ProjectToOrganizationRepository],
    exports: [ProjectToOrganizationService]
})
export class ProjectToOrganizationModule{}