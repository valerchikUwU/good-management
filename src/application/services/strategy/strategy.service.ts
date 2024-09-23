import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Strategy } from "src/domains/strategy.entity";
import { StrategyToOrganizationService } from "../strategyToOrganization/strategyToOrganization.service";
import { StrategyRepository } from "./repository/strategy.repository";
import { StrategyReadDto } from "src/contracts/strategy/read-strategy.dto";
import { StrategyCreateDto } from "src/contracts/strategy/create-strategy.dto";
import { AccountReadDto } from "src/contracts/account/read-account.dto";
import { StrategyUpdateDto } from "src/contracts/strategy/update-strategy.dto";



@Injectable()
export class StrategyService {
    constructor(
        @InjectRepository(Strategy)
        private readonly strategyRepository: StrategyRepository,
        private readonly strategyToOrganizationService: StrategyToOrganizationService
    ) {

    }

    async findAllForAccount(account: AccountReadDto): Promise<StrategyReadDto[]> {
        const strategies = await this.strategyRepository.find({where: {account: {id: account.id}}});

        return strategies.map(strategy => ({
            id: strategy.id,
            strategyNumber: strategy.strategyNumber,
            strategyName: strategy.strategyName,
            dateActive: strategy.dateActive,
            content: strategy.content,
            state: strategy.state,
            createdAt: strategy.createdAt,
            updatedAt: strategy.updatedAt,
            user: strategy.user,
            account: strategy.account,
            strategyToOrganizations: strategy.strategyToOrganizations,
            objectives: strategy.objectives,
            projects: strategy.projects
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
            content: strategy.content,
            state: strategy.state,
            createdAt: strategy.createdAt,
            updatedAt: strategy.updatedAt,
            user: strategy.user,
            account: strategy.account,
            strategyToOrganizations: strategy.strategyToOrganizations,
            objectives: strategy.objectives,
            projects: strategy.projects
        }

        return strategyReadDto;
    }

    async create(strategyCreateDto: StrategyCreateDto): Promise<Strategy> {
        const strategy = new Strategy();
        strategy.strategyName = strategyCreateDto.strategyName;
        strategy.content = strategyCreateDto.content
        strategy.state = strategyCreateDto.state;
        strategy.user = strategyCreateDto.user;
        strategy.account = strategyCreateDto.account;
        const createdStrategy = await this.strategyRepository.save(strategy);
        await this.strategyToOrganizationService.createSeveral(createdStrategy, strategyCreateDto.strategyToOrganizations);

        return createdStrategy;
    }


    async update(_id: string, updateStrategyDto: StrategyUpdateDto): Promise<StrategyReadDto> {
        const strategy = await this.strategyRepository.findOne({ where: { id: _id } });
        if (!strategy) {
            throw new NotFoundException(`Стратегия с ID ${_id} не найдена`);
        }
        // Обновить свойства, если они указаны в DTO
        if (updateStrategyDto.strategyName) strategy.strategyName = updateStrategyDto.strategyName;
        if (updateStrategyDto.content) strategy.content = updateStrategyDto.content;

        if(updateStrategyDto.strategyToOrganizations){
            await this.strategyToOrganizationService.remove(strategy);
            await this.strategyToOrganizationService.createSeveral(strategy, updateStrategyDto.strategyToOrganizations);
        }

        return this.strategyRepository.save(strategy);
    }
}