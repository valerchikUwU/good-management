import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Target } from "src/domains/target.entity";
import { TargetRepository } from "./repository/target.repository";
import { TargetReadDto } from "src/contracts/target/read-target.dto";
import { TargetCreateDto } from "src/contracts/target/create-target.dto";
import { TargetHolderService } from "../targetHolder/targetHolder.service";
import { UsersService } from "../users/users.service";
import { TargetHolderCreateDto } from "src/contracts/targetHolder/create-targetHolder.dto";



@Injectable()
export class TargetService {
    constructor(
        @InjectRepository(Target)
        private readonly targetRepository: TargetRepository,
        private readonly targetHolderService: TargetHolderService,
        private readonly userService: UsersService
    ) {

    }

    async findAll(): Promise<TargetReadDto[]> {
        const targets = await this.targetRepository.find();

        return targets.map(target => ({
            id: target.id,
            type: target.type,
            commonNumber: target.commonNumber,
            statisticNumber: target.statisticNumber,
            ruleNumber: target.ruleNumber,
            productNumber: target.productNumber,
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
            commonNumber: target.commonNumber,
            statisticNumber: target.statisticNumber,
            ruleNumber: target.ruleNumber,
            productNumber: target.productNumber,
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
        target.commonNumber = targetCreateDto.commonNumber;
        target.statisticNumber = targetCreateDto.statisticNumber;
        target.ruleNumber = targetCreateDto.ruleNumber;
        target.productNumber = targetCreateDto.productNumber;
        target.content = targetCreateDto.content;
        target.dateStart = new Date()
        target.deadline = targetCreateDto.deadline
        target.project = targetCreateDto.project
        const createdTarget = await this.targetRepository.save(target);
        const holderUser = await this.userService.findOne(targetCreateDto.holderUserId);
        const targetHolderCreateDto: TargetHolderCreateDto = {
            target: createdTarget,
            user: holderUser
        }
        await this.targetHolderService.create(targetHolderCreateDto)
        return createdTarget;
    }
}