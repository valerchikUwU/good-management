import { Module } from "@nestjs/common";
import { OrganizationModule } from "./organization.module";
import { PolicyToOrganization } from "src/domains/policyToOrganization.entity";
import { PolicyToOrganizationService } from "../services/policyToOrganization/policyToOrganization.service";
import { PolicyToOrganizationRepository } from "../services/policyToOrganization/repository/policyToOrganization.repository";
import { TypeOrmModule } from "@nestjs/typeorm";


@Module({
    imports: [TypeOrmModule.forFeature([PolicyToOrganization]), OrganizationModule],
    providers: [PolicyToOrganizationService, PolicyToOrganizationRepository],
    exports: [PolicyToOrganizationService]
})
export class PolicyToOrganizationModule{}