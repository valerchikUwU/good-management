import { Module } from "@nestjs/common";
import { OrganizationModule } from "./organization.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { StrategyToOrganization } from "src/domains/strategyToOrganization.entity";
import { StrategyToOrganizationService } from "../services/strategyToOrganization/strategyToOrganization.service";
import { StrategyToOrganizationRepository } from "../services/strategyToOrganization/repository/strategyToOrganization.repositoty";


@Module({
    imports: [TypeOrmModule.forFeature([StrategyToOrganization]), OrganizationModule],
    providers: [StrategyToOrganizationService, StrategyToOrganizationRepository],
    exports: [StrategyToOrganizationService]
})
export class StrategyToOrganizationModule{}