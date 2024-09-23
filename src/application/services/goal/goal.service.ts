import { Injectable, NotFoundException } from "@nestjs/common";
import { GoalRepository } from "./repository/goal.repository";
import { GoalReadDto } from "src/contracts/goal/read-goal.dto";
import { GoalCreateDto } from "src/contracts/goal/create-goal.dto";
import { Goal } from "src/domains/goal.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { GoalToOrganizationService } from "../goalToOrganization/goalToOrganization.service";
import { GeneratorUUID } from "../GeneratorUUID/generator.service";
import { AccountReadDto } from "src/contracts/account/read-account.dto";
import { GoalUpdateDto } from "src/contracts/goal/update-goal.dto";


@Injectable()
export class GoalService {
    constructor(
        @InjectRepository(Goal)
        private readonly goalRepository: GoalRepository,
        private readonly goalToOrganizationService: GoalToOrganizationService) { }

    async findAllForAccount(account: AccountReadDto): Promise<GoalReadDto[]> {
        const goals = await this.goalRepository.find({ where: {account: {id: account.id}}, relations: ['goalToOrganizations', 'goalToOrganizations.organization']});
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

    async findeOneById(id: string): Promise<GoalReadDto | null> {
        const goal = await this.goalRepository.findOne({ where: { id }, relations: ['user', 'goalToOrganizations'] });

        if (!goal) return null;
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

    async create(goalCreateDto: GoalCreateDto): Promise<Goal> {
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

    

    async update(_id: string, updateGoalDto: GoalUpdateDto): Promise<GoalReadDto> {
        const goal = await this.goalRepository.findOne({ where: { id: _id } });
        if (!goal) {
            throw new NotFoundException(`Политика с ID ${_id} не найдена`);
        }
        // Обновить свойства, если они указаны в DTO
        if (updateGoalDto.goalName) goal.goalName = updateGoalDto.goalName;
        if (updateGoalDto.orderNumber) goal.orderNumber = updateGoalDto.orderNumber;
        if (updateGoalDto.content) goal.content = updateGoalDto.content;

        if(updateGoalDto.goalToOrganizations){
            await this.goalToOrganizationService.remove(goal);
            await this.goalToOrganizationService.createSeveral(goal, updateGoalDto.goalToOrganizations);
        }

        return this.goalRepository.save(goal);
    }

}