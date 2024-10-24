import { BadRequestException, Inject, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { PolicyDirectory } from "src/domains/policyDirectory.entity";
import { Logger } from "winston";
import { PolicyDirectoryRepository } from "./repository/policyDirectory.repository";
import { PolicyToPolicyDirectoryService } from "../policyToPolicyDirectories/policyToPolicyDirectory.service";
import { AccountReadDto } from "src/contracts/account/read-account.dto";
import { PolicyDirectoryReadDto } from "src/contracts/policyDirectory/read-policyDirectory.dto";
import { PolicyDirectoryCreateDto } from "src/contracts/policyDirectory/create-policyDirectory.dto";
import { PolicyDirectoryUpdateDto } from "src/contracts/policyDirectory/update-policyDirectory.dto";





@Injectable()
export class PolicyDirectoryService{
    
    constructor(
        @InjectRepository(PolicyDirectory)
        private readonly policyDirectoryRepository: PolicyDirectoryRepository,
        private readonly policyToPolicyDirectoryService: PolicyToPolicyDirectoryService,
        @Inject('winston') private readonly logger: Logger,
    ) {
        
    }

    async findAllForAccount(account: AccountReadDto): Promise<PolicyDirectoryReadDto[]> {
        try {
            const policyDirectories = await this.policyDirectoryRepository.find({ where: { account: { id: account.id } }, relations: ['policyToPolicyDirectories.policy'] });

            return policyDirectories.map(policyDirectory => ({
                id: policyDirectory.id,
                directoryName: policyDirectory.directoryName,
                policyToPolicyDirectories: policyDirectory.policyToPolicyDirectories
            }))
        }
        catch (err) {

            this.logger.error(err);
            // Обработка других ошибок
            throw new InternalServerErrorException('Ошибка при получении всех папок с политиками!');
        }
    }

    async create(policyDirectoryCreateDto: PolicyDirectoryCreateDto): Promise<PolicyDirectory> {
        try {

            // Проверка на наличие обязательных данных
            if (!policyDirectoryCreateDto.directoryName) {
                throw new BadRequestException('У папки обязательно наличие названия!');
            }
            if (!policyDirectoryCreateDto.policyToPolicyDirectories) {
                throw new BadRequestException('Выберите хотя бы одну политику для папки!');
            }

            const policyDirectory = new PolicyDirectory();
            policyDirectory.directoryName = policyDirectoryCreateDto.directoryName;
            policyDirectory.account = policyDirectoryCreateDto.account;
            const createdPolicyDirectory = await this.policyDirectoryRepository.save(policyDirectory);
            await this.policyToPolicyDirectoryService.createSeveral(createdPolicyDirectory, policyDirectoryCreateDto.policyToPolicyDirectories);

            return createdPolicyDirectory
        }
        catch (err) {
            this.logger.error(err);
            // Обработка специфичных исключений
            if (err instanceof BadRequestException) {
                throw err; // Пробрасываем исключение дальше
            }
            throw new InternalServerErrorException('Ошибка при создании папки с политиками')
        }
    }


    async update(_id: string, updatePolicyDirectoryDto: PolicyDirectoryUpdateDto): Promise<PolicyDirectoryReadDto> {
        try {
            const policyDirectory = await this.policyDirectoryRepository.findOne({ where: { id: _id } });
            if (!policyDirectory) {
                throw new NotFoundException(`Папка с ID ${_id} не найдена`);
            }
            // Обновить свойства, если они указаны в DTO
            if (updatePolicyDirectoryDto.directoryName) policyDirectory.directoryName = updatePolicyDirectoryDto.directoryName;

            if (updatePolicyDirectoryDto.policyToPolicyDirectories) {
                await this.policyToPolicyDirectoryService.remove(policyDirectory);
                await this.policyToPolicyDirectoryService.createSeveral(policyDirectory, updatePolicyDirectoryDto.policyToPolicyDirectories);
            }

            return this.policyDirectoryRepository.save(policyDirectory);
        }
        catch (err) {

            this.logger.error(err);
            // Обработка специфичных исключений
            if (err instanceof NotFoundException) {
                throw err; // Пробрасываем исключение дальше
            }

            // Обработка других ошибок
            throw new InternalServerErrorException('Ошибка при обновлении папки');
        }

    }


    async remove(_id: string): Promise<void>{
        
        const policyDirectory = await this.policyDirectoryRepository.findOne({ where: { id: _id } });
        if (!policyDirectory) {
            throw new NotFoundException(`Папка с ID ${_id} не найдена`);
        }

        await this.policyToPolicyDirectoryService.remove(policyDirectory);
        await this.policyDirectoryRepository.delete({id: _id})
    }

}