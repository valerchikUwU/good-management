import { BadRequestException, Inject, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { ObjectiveRepository } from "./repository/objective.repository";
import { ObjectiveReadDto } from "src/contracts/objective/read-objective.dto";
import { Objective } from "src/domains/objective.entity";
import { ObjectiveCreateDto } from "src/contracts/objective/create-objective.dto";
import { AccountReadDto } from "src/contracts/account/read-account.dto";
import { ObjectiveUpdateDto } from "src/contracts/objective/update-objective.dto";
import { Logger } from "winston";



@Injectable()
export class ObjectiveService {
    constructor(private readonly objectiveRepository: ObjectiveRepository,
        @Inject('winston') private readonly logger: Logger
    ) { }


    async findAllForAccount(account: AccountReadDto): Promise<ObjectiveReadDto[]> {
        try {
            const objectives = await this.objectiveRepository.find({ where: { account: { id: account.id } } });

            return objectives.map(objective => ({
                id: objective.id,
                situation: objective.situation,
                content: objective.content,
                rootCause: objective.rootCause,
                createdAt: objective.createdAt,
                updatedAt: objective.updatedAt,
                strategy: objective.strategy,
                account: objective.account
            }))
        }
        catch (err) {
            this.logger.error(err);
            // Обработка других ошибок
            throw new InternalServerErrorException('Ошибка при получении всех краткосрочных целей!');
        }
    }

    async findeOneById(id: string): Promise<ObjectiveReadDto | null> {
        try {
            const objective = await this.objectiveRepository.findOne({where: {id: id }, relations: ['strategy']});

            if (!objective) throw new NotFoundException(`Краткосрочная цель с ID: ${id} не найдена`);
            const objectiveReadDto: ObjectiveReadDto = {
                id: objective.id,
                situation: objective.situation,
                content: objective.content,
                rootCause: objective.rootCause,
                createdAt: objective.createdAt,
                updatedAt: objective.updatedAt,
                strategy: objective.strategy,
                account: objective.account
            }

            return objectiveReadDto;
        }
        catch (err) {
            this.logger.error(err);
            // Обработка специфичных исключений
            if (err instanceof NotFoundException) {
                throw err; // Пробрасываем исключение дальше
            }

            // Обработка других ошибок
            throw new InternalServerErrorException('Ошибка при получении краткосрочной цели');
        }
    }

    async findeOneByStrategyId(strategyId: string): Promise<ObjectiveReadDto | null> {
        try {
            const objective = await this.objectiveRepository.findOne({where: {strategy: {id: strategyId} }, relations: ['strategy']});

            if (!objective) throw new NotFoundException(`Краткосрочная цель с ID: ${strategyId} не найдена`);;
            const objectiveReadDto: ObjectiveReadDto = {
                id: objective.id,
                situation: objective.situation,
                content: objective.content,
                rootCause: objective.rootCause,
                createdAt: objective.createdAt,
                updatedAt: objective.updatedAt,
                strategy: objective.strategy,
                account: objective.account
            }

            return objectiveReadDto;
        }
        catch (err) {
            this.logger.error(err);
            // Обработка специфичных исключений
            if (err instanceof NotFoundException) {
                throw err; // Пробрасываем исключение дальше
            }

            // Обработка других ошибок
            throw new InternalServerErrorException('Ошибка при получении краткосрочной цели по id стратегии');
        }
    }

    async create(objectiveCreateDto: ObjectiveCreateDto): Promise<Objective> {

        try {

            // Проверка на наличие обязательных данных
            if (!objectiveCreateDto.strategyId) {
                throw new BadRequestException('Выберите стратегию для краткосрочной цели!');
            }

            const objective = new Objective();
            objective.situation = objectiveCreateDto.situation;
            objective.content = objectiveCreateDto.content;
            objective.rootCause = objectiveCreateDto.rootCause;
            objective.strategy = objectiveCreateDto.strategy;
            objective.account = objectiveCreateDto.account;

            return await this.objectiveRepository.save(objective);
        }
        catch (err) {

            this.logger.error(err);
            // Обработка специфичных исключений
            if (err instanceof BadRequestException) {
                throw err; // Пробрасываем исключение дальше
            }
            throw new InternalServerErrorException('Ошибка при создании краткосрочной цели')
        }
    }


    async update(_id: string, updateObjectiveDto: ObjectiveUpdateDto): Promise<ObjectiveReadDto> {
        try {

            const objective = await this.objectiveRepository.findOne({ where: { id: _id } });
            if (!objective) {
                throw new NotFoundException(`Краткосрочная цель с ID ${_id} не найдена`);
            }
            // Обновить свойства, если они указаны в DTO
            if (updateObjectiveDto.situation) objective.situation = updateObjectiveDto.situation;
            if (updateObjectiveDto.content) objective.content = updateObjectiveDto.content;
            if (updateObjectiveDto.rootCause) objective.rootCause = updateObjectiveDto.rootCause;
            if (updateObjectiveDto.strategy) objective.strategy = updateObjectiveDto.strategy;

            return this.objectiveRepository.save(objective);
        }
        catch (err) {
            this.logger.error(err);
            // Обработка специфичных исключений
            if (err instanceof NotFoundException) {
                throw err; // Пробрасываем исключение дальше
            }

            // Обработка других ошибок
            throw new InternalServerErrorException('Ошибка при обновлении краткосрочной цели');
        }
    }
}