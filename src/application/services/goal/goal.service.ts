import { BadRequestException, Inject, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { GoalRepository } from "./repository/goal.repository";
import { GoalReadDto } from "src/contracts/goal/read-goal.dto";
import { GoalCreateDto } from "src/contracts/goal/create-goal.dto";
import { Goal } from "src/domains/goal.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { GoalToOrganizationService } from "../goalToOrganization/goalToOrganization.service";
import { GeneratorUUID } from "../GeneratorUUID/generator.service";
import { AccountReadDto } from "src/contracts/account/read-account.dto";
import { GoalUpdateDto } from "src/contracts/goal/update-goal.dto";
import { Logger } from 'winston';

@Injectable()
export class GoalService {
    constructor(
        @InjectRepository(Goal)
        private readonly goalRepository: GoalRepository,
        private readonly goalToOrganizationService: GoalToOrganizationService,
        @Inject('winston') private readonly logger: Logger
    ) { }

    async findAllForAccount(account: AccountReadDto): Promise<GoalReadDto[]> {
        try {
            const goals = await this.goalRepository.find({ where: { account: { id: account.id } }, relations: ['goalToOrganizations', 'goalToOrganizations.organization'] });
            return goals.map(goal => ({
                id: goal.id,
                goalName: goal.goalName,
                orderNumber: goal.orderNumber,
                content: goal.content,
                createdAt: goal.createdAt,
                updatedAt: goal.updatedAt,
                user: goal.user,
                account: goal.account,
                goalToOrganizations: goal.goalToOrganizations
            }));
        }
        catch (err) {

            this.logger.error(err);
            // Обработка других ошибок
            throw new InternalServerErrorException('Ошибка при получении всех целей!');
        }
    }

    async findeOneById(id: string): Promise<GoalReadDto | null> {
        try {
            const goal = await this.goalRepository.findOne({ where: { id: id }, relations: ['user', 'goalToOrganizations.organization'] });

            if (!goal) throw new NotFoundException(`Цель с ID: ${id} не найдена!`);
            const goalReadDto: GoalReadDto = {
                id: goal.id,
                goalName: goal.goalName,
                orderNumber: goal.orderNumber,
                content: goal.content,
                createdAt: goal.createdAt,
                updatedAt: goal.updatedAt,
                user: goal.user,
                account: goal.account,
                goalToOrganizations: goal.goalToOrganizations
            }
            return goalReadDto;
        }
        catch (err) {

            this.logger.error(err);
            // Обработка специфичных исключений
            if (err instanceof NotFoundException) {
                throw err; // Пробрасываем исключение дальше
            }

            // Обработка других ошибок
            throw new InternalServerErrorException('Ошибка при получении цели');
        }
    }

    async create(goalCreateDto: GoalCreateDto): Promise<Goal> {
        try {

            // Проверка на наличие обязательных данных
            if (!goalCreateDto.goalName) {
                throw new BadRequestException('У цели обязательно наличие названия!');
            }
            if (!goalCreateDto.orderNumber) {
                throw new BadRequestException('У цели должен быть порядковый номер!');
            }
            if (!goalCreateDto.content) {
                throw new BadRequestException('Цель не может быть пустой!');
            }
            if (!goalCreateDto.goalToOrganizations) {
                throw new BadRequestException('Выберите хотя бы одну организацию для цели!');
            }
            const goal = new Goal();
            goal.goalName = goalCreateDto.goalName;
            goal.orderNumber = goalCreateDto.orderNumber;
            goal.content = goalCreateDto.content;
            goal.user = goalCreateDto.user;
            goal.account = goalCreateDto.account;
            const createdGoal = await this.goalRepository.save(goal);
            await this.goalToOrganizationService.createSeveral(createdGoal, goalCreateDto.goalToOrganizations);
            return createdGoal;
        }
        catch (err) {
            this.logger.error(err);
            // Обработка специфичных исключений
            if (err instanceof BadRequestException) {
                throw err; // Пробрасываем исключение дальше
            }
            throw new InternalServerErrorException('Ошибка при создании цели')
        }
    }



    async update(_id: string, updateGoalDto: GoalUpdateDto): Promise<GoalReadDto> {
        try{

            const goal = await this.goalRepository.findOne({ where: { id: _id } });
            if (!goal) {
                throw new NotFoundException(`Политика с ID ${_id} не найдена`);
            }
            // Обновить свойства, если они указаны в DTO
            if (updateGoalDto.goalName) goal.goalName = updateGoalDto.goalName;
            if (updateGoalDto.orderNumber) goal.orderNumber = updateGoalDto.orderNumber;
            if (updateGoalDto.content) goal.content = updateGoalDto.content;
    
            if (updateGoalDto.goalToOrganizations) {
                await this.goalToOrganizationService.remove(goal);
                await this.goalToOrganizationService.createSeveral(goal, updateGoalDto.goalToOrganizations);
            }
    
            return this.goalRepository.save(goal);
        }
        catch(err){
            

            this.logger.error(err);
            // Обработка специфичных исключений
            if (err instanceof NotFoundException) {
                throw err; // Пробрасываем исключение дальше
            }

            // Обработка других ошибок
            throw new InternalServerErrorException('Ошибка при обновлении цели');
        }
    }

}