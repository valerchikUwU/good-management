import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Strategy } from "src/domains/strategy.entity";
import { StrategyToOrganizationService } from "../strategyToOrganization/strategyToOrganization.service";
import { StrategyRepository } from "./repository/strategy.repository";
import { StrategyReadDto } from "src/contracts/strategy/read-strategy.dto";
import { StrategyCreateDto } from "src/contracts/strategy/create-strategy.dto";



@Injectable()
export class StrategyService {
    constructor(
        @InjectRepository(Strategy)
        private readonly strategyRepository: StrategyRepository,
        private readonly strategyToOrganizationService: StrategyToOrganizationService
    ) {

    }

    async findAll(): Promise<StrategyReadDto[]> {
        const strategies = await this.strategyRepository.find();

        return strategies.map(strategy => ({
            id: strategy.id,
            strategyNumber: strategy.strategyNumber,
            strategyName: strategy.strategyName,
            dateActive: strategy.dateActive,
            path: strategy.path,
            size: strategy.size,
            mimetype: strategy.mimetype,
            state: strategy.state,
            createdAt: strategy.createdAt,
            updatedAt: strategy.updatedAt,
            user: strategy.user,
            strategyToOrganizations: strategy.strategyToOrganizations,
            objectives: strategy.objectives
        }))
    }

    async findeOneById(id: string): Promise<StrategyReadDto | null> {
        const strategy = await this.strategyRepository.findOneBy({ id });

        if (!strategy) return null;
        const strategyReadDto: StrategyReadDto = {
            id: strategy.id,
            strategyNumber: strategy.strategyNumber,
            strategyName: strategy.strategyName,
            dateActive: strategy.dateActive,
            path: strategy.path,
            size: strategy.size,
            mimetype: strategy.mimetype,
            state: strategy.state,
            createdAt: strategy.createdAt,
            updatedAt: strategy.updatedAt,
            user: strategy.user,
            strategyToOrganizations: strategy.strategyToOrganizations,
            objectives: strategy.objectives
        }

        return strategyReadDto;
    }

    async create(strategyCreateDto: StrategyCreateDto): Promise<Strategy> {
        const strategy = new Strategy();
        strategy.strategyNumber = strategyCreateDto.strategyNumber;
        strategy.strategyName = strategyCreateDto.strategyName;
        strategy.path = strategyCreateDto.path;
        strategy.size = strategyCreateDto.size;
        strategy.mimetype = strategyCreateDto.mimetype;
        strategy.state = strategyCreateDto.state;
        strategy.user = strategyCreateDto.user;
        strategy.strategyToOrganizations = await this.strategyToOrganizationService.createSeveral(strategy, strategyCreateDto.strategyToOrganizations);

        return await this.strategyRepository.save(strategy);
    }
}