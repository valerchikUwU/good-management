import { Injectable } from "@nestjs/common";
import { GoalRepository } from "./repository/goal.repository";
import { GoalReadDto } from "src/contracts/goal/read-goal.dto";
import { GoalCreateDto } from "src/contracts/goal/create-goal.dto";
import { Goal } from "src/domains/goal.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { GoalToOrganizationService } from "../goalToOrganization/goalToOrganization.service";


@Injectable()
export class GoalService{
    constructor(
        @InjectRepository(Goal)
        private readonly goalRepository: GoalRepository,
        private readonly goalToOrganizationService: GoalToOrganizationService    )
    {}

    async findAll(): Promise<GoalReadDto[]> {
        const goals = await this.goalRepository.find();
        return goals.map(goal => ({
            id: goal.id,
            goalName: goal.goalName,
            orderNumber: goal.orderNumber,
            content: goal.content,
            createdAt: goal.createdAt,
            updatedAt: goal.updatedAt,
            user: goal.user,
            goalToOrganizations: goal.goalToOrganizations
        }));
    }

    async findeOneById(id: string): Promise<GoalReadDto | null>{
        const goal = await this.goalRepository.findOneBy({id});
        
        if (!goal) return null;
        const goalReadDto: GoalReadDto = {
            id: goal.id,
            goalName: goal.goalName,
            orderNumber: goal.orderNumber,
            content: goal.content,
            createdAt: goal.createdAt,
            updatedAt: goal.updatedAt,
            user: goal.user,
            goalToOrganizations: goal.goalToOrganizations
        }

        return goalReadDto;
    }

    async create(goalCreateDto: GoalCreateDto): Promise<Goal>{
        const goal = new Goal();
        goal.goalName = goalCreateDto.goalName;
        goal.orderNumber = goalCreateDto.orderNumber;
        goal.content = goalCreateDto.content;
        goal.goalToOrganizations = await this.goalToOrganizationService.createSeveral(goal, goalCreateDto.goalToOrganizations)

        return await this.goalRepository.save(goal);
    }

}