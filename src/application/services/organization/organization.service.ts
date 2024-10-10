import { BadRequestException, Inject, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { OrganizationRepository } from "./repository/organization.repository";
import { OrganizationReadDto } from "src/contracts/organization/read-organization.dto";
import { OrganizationCreateDto } from "src/contracts/organization/create-organization.dto";
import { Organization } from "src/domains/organization.entity";
import { AccountReadDto } from "src/contracts/account/read-account.dto";
import { OrganizationUpdateDto } from "src/contracts/organization/update-organization.dto";
import { Logger } from "winston";


@Injectable()
export class OrganizationService {
    constructor(private readonly organizationRepository: OrganizationRepository,
        @Inject('winston') private readonly logger: Logger) {

    }

    async findAllForAccount(account: AccountReadDto): Promise<OrganizationReadDto[]> {
        try {

            const organizations = await this.organizationRepository.find({ where: { account: { id: account.id } }, relations: ['goal'] });
            return organizations.map(organization => ({
                id: organization.id,
                organizationName: organization.organizationName,
                parentOrganizationId: organization.parentOrganizationId,
                createdAt: organization.createdAt,
                updatedAt: organization.updatedAt,
                users: organization.users,
                posts: organization.posts,
                goal: organization.goal,
                policyToOrganizations: organization.policyToOrganizations,
                projectToOrganizations: organization.projectToOrganizations,
                strategyToOrganizations: organization.strategyToOrganizations,
                account: organization.account,
            }));
        }
        catch (err) {

            this.logger.error(err);
            // Обработка других ошибок
            throw new InternalServerErrorException('Ошибка при получении всех организаций!');
        }
    }

    async findOneById(id: string): Promise<OrganizationReadDto | null> {
        try {
            const organization = await this.organizationRepository.findOneBy({ id });

            if (!organization) throw new NotFoundException(`Организация с ID: ${id} не найдена`);
            const organizationReadDto: OrganizationReadDto = {
                id: organization.id,
                organizationName: organization.organizationName,
                parentOrganizationId: organization.parentOrganizationId,
                createdAt: organization.createdAt,
                updatedAt: organization.updatedAt,
                users: organization.users,
                posts: organization.posts,
                goal: organization.goal,
                policyToOrganizations: organization.policyToOrganizations,
                projectToOrganizations: organization.projectToOrganizations,
                strategyToOrganizations: organization.strategyToOrganizations,
                account: organization.account,
            }

            return organizationReadDto;
        }
        catch (err) {
            this.logger.error(err);
            // Обработка специфичных исключений
            if (err instanceof NotFoundException) {
                throw err; // Пробрасываем исключение дальше
            }

            // Обработка других ошибок
            throw new InternalServerErrorException('Ошибка при получении организации');
        }
    }

    async create(organizationCreateDto: OrganizationCreateDto): Promise<Organization> {

        try {
            // Проверка на наличие обязательных данных
            if (!organizationCreateDto.organizationName) {
                throw new BadRequestException('У организации должно быть название!');
            }
            const organization = new Organization();
            organization.organizationName = organizationCreateDto.organizationName;
            organization.parentOrganizationId = organizationCreateDto.parentOrganizationId;
            organization.account = organizationCreateDto.account;

            return await this.organizationRepository.save(organization);
        }
        catch (err) {

            this.logger.error(err);
            // Обработка специфичных исключений
            if (err instanceof BadRequestException) {
                throw err; // Пробрасываем исключение дальше
            }
            throw new InternalServerErrorException('Ошибка при создании организации')
        }
    }




    async update(_id: string, updateOrganizationDto: OrganizationUpdateDto): Promise<OrganizationReadDto> {
        try {
            const organization = await this.organizationRepository.findOne({ where: { id: _id } });
            if (!organization) {
                throw new NotFoundException(`Организация с ID ${_id} не найдена`);
            }
            // Обновить свойства, если они указаны в DTO
            if (updateOrganizationDto.organizationName) organization.organizationName = updateOrganizationDto.organizationName;
            if (updateOrganizationDto.parentOrganizationId) organization.parentOrganizationId = updateOrganizationDto.parentOrganizationId;

            return this.organizationRepository.save(organization);
        }
        catch (err) {
            this.logger.error(err);
            // Обработка специфичных исключений
            if (err instanceof NotFoundException) {
                throw err; // Пробрасываем исключение дальше
            }

            // Обработка других ошибок
            throw new InternalServerErrorException('Ошибка при обновлении организации');
        }
    }

}