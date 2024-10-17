import { BadRequestException, Inject, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { State, Strategy } from "src/domains/strategy.entity";
import { StrategyToOrganizationService } from "../strategyToOrganization/strategyToOrganization.service";
import { StrategyRepository } from "./repository/strategy.repository";
import { StrategyReadDto } from "src/contracts/strategy/read-strategy.dto";
import { StrategyCreateDto } from "src/contracts/strategy/create-strategy.dto";
import { AccountReadDto } from "src/contracts/account/read-account.dto";
import { StrategyUpdateDto } from "src/contracts/strategy/update-strategy.dto";
import { Logger } from "winston";
import { IsNull, Not } from "typeorm";
import { IsNotEmpty } from "class-validator";



@Injectable()
export class StrategyService {
    constructor(
        @InjectRepository(Strategy)
        private readonly strategyRepository: StrategyRepository,
        private readonly strategyToOrganizationService: StrategyToOrganizationService,
        @Inject('winston') private readonly logger: Logger
    ) {

    }

    async findAllForAccount(account: AccountReadDto): Promise<StrategyReadDto[]> {
        try {

            const strategies = await this.strategyRepository.find({ where: { account: { id: account.id } } });

            return strategies.map(strategy => ({
                id: strategy.id,
                strategyNumber: strategy.strategyNumber,
                dateActive: strategy.dateActive,
                content: strategy.content,
                state: strategy.state,
                createdAt: strategy.createdAt,
                updatedAt: strategy.updatedAt,
                user: strategy.user,
                account: strategy.account,
                strategyToOrganizations: strategy.strategyToOrganizations,
                objective: strategy.objective,
                projects: strategy.projects
            }))
        }
        catch (err) {

            this.logger.error(err);
            // Обработка других ошибок
            throw new InternalServerErrorException('Ошибка при получении всех стратегий!');

        }
    }


    async findAllActiveWithoutObjectiveForAccount(account: AccountReadDto): Promise<StrategyReadDto[]> {
        try {

            const strategies = await this.strategyRepository.find({ where: { account: { id: account.id }, state: State.ACTIVE, objective: {id: IsNull()}}});

            return strategies.map(strategy => ({
                id: strategy.id,
                strategyNumber: strategy.strategyNumber,
                dateActive: strategy.dateActive,
                content: strategy.content,
                state: strategy.state,
                createdAt: strategy.createdAt,
                updatedAt: strategy.updatedAt,
                user: strategy.user,
                account: strategy.account,
                strategyToOrganizations: strategy.strategyToOrganizations,
                objective: strategy.objective,
                projects: strategy.projects
            }))
        }
        catch (err) {

            this.logger.error(err);
            // Обработка других ошибок
            throw new InternalServerErrorException('Ошибка при получении всех стратегий!');

        }
    }

    async findAllActiveForAccount(account: AccountReadDto): Promise<StrategyReadDto[]> {
        try {

            const strategies = await this.strategyRepository.find({ where: { account: { id: account.id }, state: State.ACTIVE}});

            return strategies.map(strategy => ({
                id: strategy.id,
                strategyNumber: strategy.strategyNumber,
                dateActive: strategy.dateActive,
                content: strategy.content,
                state: strategy.state,
                createdAt: strategy.createdAt,
                updatedAt: strategy.updatedAt,
                user: strategy.user,
                account: strategy.account,
                strategyToOrganizations: strategy.strategyToOrganizations,
                objective: strategy.objective,
                projects: strategy.projects
            }))
        }
        catch (err) {

            this.logger.error(err);
            // Обработка других ошибок
            throw new InternalServerErrorException('Ошибка при получении всех стратегий!');

        }
    }

    async findAllRelatedForAccount(account: AccountReadDto): Promise<StrategyReadDto[]> {
        try {

            const strategies = await this.strategyRepository.find({ where: { account: { id: account.id }, state: State.ACTIVE, objective: {id: Not(IsNull()) }}});

            return strategies.map(strategy => ({
                id: strategy.id,
                strategyNumber: strategy.strategyNumber,
                dateActive: strategy.dateActive,
                content: strategy.content,
                state: strategy.state,
                createdAt: strategy.createdAt,
                updatedAt: strategy.updatedAt,
                user: strategy.user,
                account: strategy.account,
                strategyToOrganizations: strategy.strategyToOrganizations,
                objective: strategy.objective,
                projects: strategy.projects
            }))
        }
        catch (err) {

            this.logger.error(err);
            // Обработка других ошибок
            throw new InternalServerErrorException('Ошибка при получении всех стратегий!');

        }
    }

    async findOneById(id: string): Promise<StrategyReadDto | null> {
        try {
            const strategy = await this.strategyRepository.findOne({ where: { id: id }, relations: ['strategyToOrganizations.organization'] });

            if (!strategy) throw new NotFoundException(`Стратегия с ID: ${id} не найдена`);
            const strategyReadDto: StrategyReadDto = {
                id: strategy.id,
                strategyNumber: strategy.strategyNumber,
                dateActive: strategy.dateActive,
                content: strategy.content,
                state: strategy.state,
                createdAt: strategy.createdAt,
                updatedAt: strategy.updatedAt,
                user: strategy.user,
                account: strategy.account,
                strategyToOrganizations: strategy.strategyToOrganizations,
                objective: strategy.objective,
                projects: strategy.projects
            }

            return strategyReadDto;
        }
        catch (err) {

            this.logger.error(err);
            // Обработка специфичных исключений
            if (err instanceof NotFoundException) {
                throw err; // Пробрасываем исключение дальше
            }

            // Обработка других ошибок
            throw new InternalServerErrorException('Ошибка при получении стратегии');
        }
    }

    async create(strategyCreateDto: StrategyCreateDto): Promise<Strategy> {

        try {

            if (!strategyCreateDto.content) {
                throw new BadRequestException('Стратегия не может быть пустой!');
            }
            if (!strategyCreateDto.strategyToOrganizations) {
                throw new BadRequestException('Выберите хотя бы одну организацию для стратегии!');
            }

            const strategy = new Strategy();
            strategy.content = strategyCreateDto.content
            strategy.user = strategyCreateDto.user;
            strategy.account = strategyCreateDto.account;
            const createdStrategy = await this.strategyRepository.save(strategy);
            await this.strategyToOrganizationService.createSeveral(createdStrategy, strategyCreateDto.strategyToOrganizations);

            return createdStrategy;
        }
        catch (err) {
            this.logger.error(err);
            // Обработка специфичных исключений
            if (err instanceof BadRequestException) {
                throw err; // Пробрасываем исключение дальше
            }
            throw new InternalServerErrorException('Ошибка при создании стратегии')
        }
    }


    async update(_id: string, updateStrategyDto: StrategyUpdateDto): Promise<StrategyReadDto> {
        try {

            const strategy = await this.strategyRepository.findOne({ where: { id: _id } });
            if (!strategy) {
                throw new NotFoundException(`Стратегия с ID ${_id} не найдена`);
            }
            // Обновить свойства, если они указаны в DTO
            if (updateStrategyDto.content) strategy.content = updateStrategyDto.content;
            if (updateStrategyDto.state){
                if (updateStrategyDto.state === State.DRAFT) {
                    const existingDraftStrategy = await this.strategyRepository.findOne({ where: { state: State.DRAFT } });
                    if (existingDraftStrategy) {
                      throw new BadRequestException('Может существовать только одна стратегия со статусом "Черновик".');
                    }
                  }
                  else if (updateStrategyDto.state === State.ACTIVE){
                    const existingActiveStrategy = await this.strategyRepository.findOne({ where: { state: State.DRAFT } });
                    if (existingActiveStrategy) {
                      throw new BadRequestException('Может существовать только одна стратегия со статусом "Активный".');
                    }
                    strategy.dateActive = new Date();
                  }
                strategy.state = updateStrategyDto.state;
            } 

            if (updateStrategyDto.strategyToOrganizations) {
                await this.strategyToOrganizationService.remove(strategy);
                await this.strategyToOrganizationService.createSeveral(strategy, updateStrategyDto.strategyToOrganizations);
            }

            return this.strategyRepository.save(strategy);
        }
        catch (err) {
            this.logger.error(err);
            if (err instanceof NotFoundException) {
                throw err;
            }
            throw new InternalServerErrorException('Ой, что - то пошло не так при обновлении стратегии!')
        }
    }
}