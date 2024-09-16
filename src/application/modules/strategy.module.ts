import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Strategy } from "src/domains/strategy.entity";
import { StrategyToOrganizationModule } from "./strategyToOrganization.module";
import { StrategyService } from "../services/strategy/strategy.service";
import { StrategyRepository } from "../services/strategy/repository/strategy.repository";
import { StrategyController } from "src/controllers/strategy.controller";


@Module({
    imports: [TypeOrmModule.forFeature([Strategy]),
    StrategyToOrganizationModule],
    controllers: [StrategyController],
    providers: [StrategyService, StrategyRepository]
})
export class StrategyModule{}