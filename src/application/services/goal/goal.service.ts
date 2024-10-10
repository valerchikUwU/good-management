import { BadRequestException, Inject, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { GoalRepository } from "./repository/goal.repository";
import { GoalReadDto } from "src/contracts/goal/read-goal.dto";
import { GoalCreateDto } from "src/contracts/goal/create-goal.dto";
import { Goal } from "src/domains/goal.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { AccountReadDto } from "src/contracts/account/read-account.dto";
import { GoalUpdateDto } from "src/contracts/goal/update-goal.dto";
import { Logger } from 'winston';

@Injectable()
export class GoalService {
    constructor(
        @InjectRepository(Goal)
        private readonly goalRepository: GoalRepository,
        @Inject('winston') private readonly logger: Logger
    ) { }

    async findAllForAccount(account: AccountReadDto): Promise<GoalReadDto[]> {
        try {
            const goals = await this.goalRepository.find({ where: { account: { id: account.id } }, relations: ['organization'] });
            return goals.map(goal => ({
                id: goal.id,
                content: goal.content,
                createdAt: goal.createdAt,
                updatedAt: goal.updatedAt,
                user: goal.user,
                account: goal.account,
                organization: goal.organization
            }));
        }
        catch (err) {

            this.logger.error(err);
            // Обработка других ошибок
            throw new InternalServerErrorException('Ошибка при получении всех целей!');
        }
    }

    async findOneById(id: string): Promise<GoalReadDto> {
        try {
            const goal = await this.goalRepository.findOne({ where: { id: id }, relations: ['user', 'organization'] });

            if (!goal) throw new NotFoundException(`Цель с ID: ${id} не найдена!`);
            const goalReadDto: GoalReadDto = {
                id: goal.id,
                content: goal.content,
                createdAt: goal.createdAt,
                updatedAt: goal.updatedAt,
                organization: goal.organization
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

    async create(goalCreateDto: GoalCreateDto): Promise<GoalReadDto> {
        try {

            // Проверка на наличие обязательных данных
            if (!goalCreateDto.content) {
                throw new BadRequestException('Цель не может быть пустой!');
            }
            const goal = new Goal();
            goal.content = goalCreateDto.content;
            goal.user = goalCreateDto.user;
            goal.account = goalCreateDto.account;
            goal.organization = goalCreateDto.organization;
            const createdGoal = await this.goalRepository.save(goal);
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
                throw new NotFoundException(`Цель с ID ${_id} не найдена`);
            }
            // Обновить свойства, если они указаны в DTO
            if (updateGoalDto.content) goal.content = updateGoalDto.content;
            const updatedGoal =  await this.goalRepository.save(goal);
            return updatedGoal;
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