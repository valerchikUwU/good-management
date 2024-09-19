import { Injectable } from "@nestjs/common";
import { ObjectiveRepository } from "./repository/objective.repository";
import { ObjectiveReadDto } from "src/contracts/objective/read-objective.dto";
import { Objective } from "src/domains/objective.entity";
import { ObjectiveCreateDto } from "src/contracts/objective/create-objective.dto";
import { AccountReadDto } from "src/contracts/account/read-account.dto";



@Injectable()
export class ObjectiveService{
    constructor(private readonly objectiveRepository: ObjectiveRepository,
    ){}

    
    async findAllForAccount(account: AccountReadDto): Promise<ObjectiveReadDto[]> {
        const objectives = await this.objectiveRepository.find({where: {account: {id: account.id}}});

        return objectives.map(objective => ({
            id: objective.id,
            orderNumber: objective.orderNumber,
            situation: objective.situation,
            content: objective.content,
            rootCause: objective.rootCause,
            createdAt: objective.createdAt,
            updatedAt: objective.updatedAt,
            strategy: objective.strategy,
            account: objective.account
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
            strategy: objective.strategy,
            account: objective.account
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
        objective.account = objectiveCreateDto.account;

        return await this.objectiveRepository.save(objective);
    }
}