import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TargetHolder } from "src/domains/targetHolder.entity";
import { TargetHolderRepository } from "./repository/targetHolder.repository";
import { TargetHolderReadDto } from "src/contracts/targetHolder/read-targetHolder.dto";
import { TargetHolderCreateDto } from "src/contracts/targetHolder/create-targetHolder.dto";



@Injectable()
export class TargetHolderService {
    constructor(
        @InjectRepository(TargetHolder)
        private readonly targetHolderRepository: TargetHolderRepository,
    ) {

    }

    async findAll(): Promise<TargetHolderReadDto[]> {
        const targetHolders = await this.targetHolderRepository.find();

        return targetHolders.map(targetHolder => ({
            id: targetHolder.id,
            target: targetHolder.target,
            user: targetHolder.user
        }))
    }

    async findeOneById(id: string): Promise<TargetHolderReadDto | null> {
        const targetHolder = await this.targetHolderRepository.findOneBy({ id });

        if (!targetHolder) return null;
        const targetHolderReadDto: TargetHolderReadDto = {
            id: targetHolder.id,
            target: targetHolder.target,
            user: targetHolder.user
        }

        return targetHolderReadDto;
    }

    async create(targetHolderCreateDto: TargetHolderCreateDto): Promise<TargetHolder> {
        const targetHolder = new TargetHolder();
        targetHolder.target = targetHolderCreateDto.target;
        targetHolder.user = targetHolderCreateDto.user;

        return await this.targetHolderRepository.save(targetHolder);
    }
}