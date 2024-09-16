import { Injectable } from "@nestjs/common";
import { ObjectiveRepository } from "./repository/objective.repository";
import { ObjectiveReadDto } from "src/contracts/objective/read-objective.dto";
import { Objective } from "src/domains/objective.entity";
import { ObjectiveCreateDto } from "src/contracts/objective/create-objective.dto";
import { ObjectiveToOrganizationService } from "../objectiveToOrganization/objectiveToOrganization.service";



@Injectable()
export class ObjectiveService{
    constructor(private readonly objectiveRepository: ObjectiveRepository,
        private readonly objectiveToOrganizationService: ObjectiveToOrganizationService
    ){}

    
    async findAll(): Promise<ObjectiveReadDto[]> {
        const objectives = await this.objectiveRepository.find();

        return objectives.map(objective => ({
            id: objective.id,
            orderNumber: objective.orderNumber,
            situation: objective.situation,
            content: objective.content,
            rootCause: objective.rootCause,
            createdAt: objective.createdAt,
            updatedAt: objective.updatedAt,
            objectiveToOrganizations: objective.objectiveToOrganizations,
            strategy: objective.strategy
        }))
    }

    async findeOneById(id: string): Promise<ObjectiveReadDto | null> {
        const objective = await this.objectiveRepository.findOneBy({ id });

        if (!objective) return null;
        const objectiveReadDto: ObjectiveReadDto = {
            id: objective.id,
            orderNumber: objective.orderNumber,
            situation: objective.situation,
            content: objective.content,
            rootCause: objective.rootCause,
            createdAt: objective.createdAt,
            updatedAt: objective.updatedAt,
            objectiveToOrganizations: objective.objectiveToOrganizations,
            strategy: objective.strategy
        }

        return objectiveReadDto;
    }

    async create(objectiveCreateDto: ObjectiveCreateDto): Promise<Objective> {
        const objective = new Objective();
        objective.orderNumber = objectiveCreateDto.orderNumber;
        objective.situation = objectiveCreateDto.situation;
        objective.content = objectiveCreateDto.content;
        objective.rootCause = objectiveCreateDto.rootCause;
        objective.strategy = objectiveCreateDto.strategy;
        objective.objectiveToOrganizations = await this.objectiveToOrganizationService.createSeveral(objective, objectiveCreateDto.objectiveToOrganizations);

        return await this.objectiveRepository.save(objective);
    }
}