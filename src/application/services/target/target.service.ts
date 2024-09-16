import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Target } from "src/domains/target.entity";
import { TargetRepository } from "./repository/target.repository";
import { TargetReadDto } from "src/contracts/target/read-target.dto";
import { TargetCreateDto } from "src/contracts/target/create-target.dto";



@Injectable()
export class TargetService {
    constructor(
        @InjectRepository(Target)
        private readonly targetRepository: TargetRepository,
    ) {

    }

    async findAll(): Promise<TargetReadDto[]> {
        const targets = await this.targetRepository.find();

        return targets.map(target => ({
            id: target.id,
            type: target.type,
            orderNumber: target.orderNumber,
            content: target.content,
            dateStart: target.dateStart,
            deadline: target.deadline,
            dateComplete: target.dateComplete,
            createdAt: target.createdAt,
            updatedAt: target.updatedAt,
            targetHolder: target.targetHolder,
            project: target.project,
        }))
    }

    async findeOneById(id: string): Promise<TargetReadDto | null> {
        const target = await this.targetRepository.findOneBy({ id });

        if (!target) return null;
        const targetReadDto: TargetReadDto = {
            id: target.id,
            type: target.type,
            orderNumber: target.orderNumber,
            content: target.content,
            dateStart: target.dateStart,
            deadline: target.deadline,
            dateComplete: target.dateComplete,
            createdAt: target.createdAt,
            updatedAt: target.updatedAt,
            targetHolder: target.targetHolder,
            project: target.project,
        }

        return targetReadDto;
    }

    async create(targetCreateDto: TargetCreateDto): Promise<Target> {
        const target = new Target();
        target.type = targetCreateDto.type;
        target.orderNumber = targetCreateDto.orderNumber;
        target.content = targetCreateDto.content;
        target.dateStart = new Date()
        target.deadline = targetCreateDto.deadline
        target.targetHolder = targetCreateDto.targetHolder;
        target.project = targetCreateDto.project

        return await this.targetRepository.save(target);
    }
}