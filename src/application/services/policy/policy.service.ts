import { BadRequestException, Inject, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { PolicyRepository } from "./repository/policy.repository";
import { InjectRepository } from "@nestjs/typeorm";
import { Policy, State, Type } from "src/domains/policy.entity";
import { PolicyReadDto } from "src/contracts/policy/read-policy.dto";
import { PolicyCreateDto } from "src/contracts/policy/create-policy.dto";
import { PolicyToOrganizationService } from "../policyToOrganization/policyToOrganization.service";
import { AccountReadDto } from "src/contracts/account/read-account.dto";
import { PolicyUpdateDto } from "src/contracts/policy/update-policy.dto";
import { Logger } from 'winston';
import { IsNull } from "typeorm";



@Injectable()
export class PolicyService {
    constructor(
        @InjectRepository(Policy)
        private readonly policyRepository: PolicyRepository,
        private readonly policyToOrganizationService: PolicyToOrganizationService,
        @Inject('winston') private readonly logger: Logger,
    ) {

    }

    async findAllForAccount(account: AccountReadDto): Promise<PolicyReadDto[]> {
        try {
            const policies = await this.policyRepository.find({ where: { account: { id: account.id } } });

            return policies.map(policy => ({
                id: policy.id,
                policyName: policy.policyName,
                policyNumber: policy.policyNumber,
                state: policy.state,
                type: policy.type,
                dateActive: policy.dateActive,
                content: policy.content,
                createdAt: policy.createdAt,
                updatedAt: policy.updatedAt,
                post: policy.post,
                policyToOrganizations: policy.policyToOrganizations,
                user: policy.user,
                account: policy.account,
                files: policy.files,
                policyToPolicyDirectories: policy.policyToPolicyDirectories
            }))
        }
        catch (err) {

            this.logger.error(err);
            // Обработка других ошибок
            throw new InternalServerErrorException('Ошибка при получении всех политик!');
        }
    }

    async findAllWithoutPost(account: AccountReadDto): Promise<PolicyReadDto[]> {
        try {
            const policies = await this.policyRepository.find({ where: { account: { id: account.id }, state: State.ACTIVE, post: {id: IsNull()} }, relations: ['post'] });

            return policies.map(policy => ({
                id: policy.id,
                policyName: policy.policyName,
                policyNumber: policy.policyNumber,
                state: policy.state,
                type: policy.type,
                dateActive: policy.dateActive,
                content: policy.content,
                createdAt: policy.createdAt,
                updatedAt: policy.updatedAt,
                post: policy.post,
                policyToOrganizations: policy.policyToOrganizations,
                user: policy.user,
                account: policy.account,
                files: policy.files,
                policyToPolicyDirectories: policy.policyToPolicyDirectories
            }))
        }
        catch (err) {

            this.logger.error(err);
            // Обработка других ошибок
            throw new InternalServerErrorException('Ошибка при получении всех политик!');
        }
    }

    async findOneById(id: string): Promise<PolicyReadDto | null> {
        try {
            const policy = await this.policyRepository.findOne({where: { id }, relations: ['policyToOrganizations.organization', 'files']});
            if (!policy) throw new NotFoundException(`Политика с ID: ${id} не найдена`);
            const policyReadDto: PolicyReadDto = {
                id: policy.id,
                policyName: policy.policyName,
                policyNumber: policy.policyNumber,
                state: policy.state,
                type: policy.type,
                dateActive: policy.dateActive,
                content: policy.content,
                createdAt: policy.createdAt,
                updatedAt: policy.updatedAt,
                post: policy.post,
                policyToOrganizations: policy.policyToOrganizations,
                user: policy.user,
                account: policy.account,
                files: policy.files,
                policyToPolicyDirectories: policy.policyToPolicyDirectories
            }

            return policyReadDto;
        }
        catch (err) {

            this.logger.error(err);
            // Обработка специфичных исключений
            if (err instanceof NotFoundException) {
                throw err; // Пробрасываем исключение дальше
            }

            // Обработка других ошибок
            throw new InternalServerErrorException('Ошибка при получении политики');
        }

    }

    async create(policyCreateDto: PolicyCreateDto): Promise<string> {
        try {

            // Проверка на наличие обязательных данных
            if (!policyCreateDto.policyName) {
                throw new BadRequestException('У политики обязательно наличие названия!');
            }
            if (!policyCreateDto.content) {
                throw new BadRequestException('Политика не может быть пустой!');
            }
            if (!policyCreateDto.policyToOrganizations) {
                throw new BadRequestException('Выберите хотя бы одну организацию для политики!');
            }

            const policy = new Policy();
            policy.policyName = policyCreateDto.policyName;
            policy.state = policyCreateDto.state;
            policy.type = policyCreateDto.type;
            policy.content = policyCreateDto.content;
            policy.user = policyCreateDto.user;
            policy.account = policyCreateDto.account;
            if (policyCreateDto.state === State.ACTIVE) policy.dateActive = new Date();
            const createdPolicy = await this.policyRepository.save(policy);
            await this.policyToOrganizationService.createSeveral(createdPolicy, policyCreateDto.policyToOrganizations);

            return createdPolicy.id
        }
        catch (err) {
            this.logger.error(err);
            // Обработка специфичных исключений
            if (err instanceof BadRequestException) {
                throw err; // Пробрасываем исключение дальше
            }
            throw new InternalServerErrorException('Ошибка при создании политики')
        }
    }


    async findDirectivesForAccount(account: AccountReadDto): Promise<PolicyReadDto[]> {
        try {
            // Поиск всех политик с типом DIRECTIVE
            const directives = await this.policyRepository.find({ where: { type: Type.DIRECTIVE, account: { id: account.id } } });

            return directives;
        }
        catch (err) {
            this.logger.error(err);
            throw new InternalServerErrorException('Ошибка при получении директив!')
        }
    }

    async findInstructionsForAccount(account: AccountReadDto): Promise<PolicyReadDto[]> {
        try {
            // Поиск всех политик с типом INSTRUCTION
            const instructions = await this.policyRepository.find({ where: { type: Type.INSTRUCTION, account: { id: account.id } } });
            return instructions
        }
        catch (err) {

            this.logger.error(err);
            throw new InternalServerErrorException('Ошибка при получении инструкций!')
        }
    }

    async update(_id: string, updatePolicyDto: PolicyUpdateDto): Promise<string> {
        try {
            const policy = await this.policyRepository.findOne({ where: { id: _id } });
            if (!policy) {
                throw new NotFoundException(`Политика с ID ${_id} не найдена`);
            }
            // Обновить свойства, если они указаны в DTO
            if (updatePolicyDto.policyName) policy.policyName = updatePolicyDto.policyName;
            if (updatePolicyDto.state) policy.state = updatePolicyDto.state;
            if (updatePolicyDto.type) policy.type = updatePolicyDto.type;
            if (updatePolicyDto.content) policy.content = updatePolicyDto.content;
            if (updatePolicyDto.state === State.ACTIVE) policy.dateActive = new Date();

            if (updatePolicyDto.policyToOrganizations) {
                await this.policyToOrganizationService.remove(policy);
                await this.policyToOrganizationService.createSeveral(policy, updatePolicyDto.policyToOrganizations);
            }
            await this.policyRepository.update(policy.id, {policyName: policy.policyName, state: policy.state, type: policy.type, content: policy.content, dateActive: policy.dateActive});
            return policy.id
        }
        catch (err) {

            this.logger.error(err);
            // Обработка специфичных исключений
            if (err instanceof NotFoundException) {
                throw err; // Пробрасываем исключение дальше
            }

            // Обработка других ошибок
            throw new InternalServerErrorException('Ошибка при обновлении политики');
        }

    }
}