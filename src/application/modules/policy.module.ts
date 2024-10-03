import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Policy } from "src/domains/policy.entity";
import { PolicyService } from "../services/policy/policy.service";
import { PolicyRepository } from "../services/policy/repository/policy.repository";
import { PolicyController } from "src/controllers/policy.controller";
import { PolicyToOrganizationModule } from "./policyToOrganization.module";
import { UsersModule } from "./users.module";
import { OrganizationModule } from "./organization.module";
import { RoleSettingModule } from "./roleSetting.module";


@Module({
    imports: [TypeOrmModule.forFeature([Policy]),
    PolicyToOrganizationModule, UsersModule, OrganizationModule, RoleSettingModule],
    controllers: [PolicyController],
    providers: [PolicyService, PolicyRepository],
    exports: [PolicyService]
})
export class PolicyModule{}