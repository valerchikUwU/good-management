import { Injectable, NotFoundException } from "@nestjs/common";
import { OrganizationRepository } from "./repository/organization.repository";
import { OrganizationReadDto } from "src/contracts/organization/read-organization.dto";
import { OrganizationCreateDto } from "src/contracts/organization/create-organization.dto";
import { Organization } from "src/domains/organization.entity";
import { AccountReadDto } from "src/contracts/account/read-account.dto";
import { OrganizationUpdateDto } from "src/contracts/organization/update-organization.dto";


@Injectable()
export class OrganizationService {
    constructor(private readonly organizationRepository: OrganizationRepository) {

    }

    async findAllForAccount(account: AccountReadDto): Promise<OrganizationReadDto[]> {
        const organizations = await this.organizationRepository.find({where: { account: { id: account.id } }});
        return organizations.map(organization => ({
            id: organization.id,
            organizationName: organization.organizationName,
            parentOrganizationId: organization.parentOrganizationId,
            createdAt: organization.createdAt,
            updatedAt: organization.updatedAt,
            users: organization.users,
            posts: organization.posts,
            goalToOrganizations: organization.goalToOrganizations,
            policyToOrganizations: organization.policyToOrganizations,
            projectToOrganizations: organization.projectToOrganizations,
            strategyToOrganizations: organization.strategyToOrganizations,
            account: organization.account,
        }));
    }

    async findOneById(id: string): Promise<OrganizationReadDto | null> {
        const organization = await this.organizationRepository.findOneBy({ id });

        if (!organization) return null;
        const organizationReadDto: OrganizationReadDto = {
            id: organization.id,
            organizationName: organization.organizationName,
            parentOrganizationId: organization.parentOrganizationId,
            createdAt: organization.createdAt,
            updatedAt: organization.updatedAt,
            users: organization.users,
            posts: organization.posts,
            goalToOrganizations: organization.goalToOrganizations,
            policyToOrganizations: organization.policyToOrganizations,
            projectToOrganizations: organization.projectToOrganizations,
            strategyToOrganizations: organization.strategyToOrganizations,
            account: organization.account,
        }

        return organizationReadDto;
    }

    async create(organizationCreateDto: OrganizationCreateDto): Promise<Organization> {
        const organization = new Organization();
        organization.organizationName = organizationCreateDto.organizationName;
        organization.parentOrganizationId = organizationCreateDto.parentOrganizationId;
        organization.account = organizationCreateDto.account;

        return await this.organizationRepository.save(organization);
    }


    

    async update(_id: string, updateOrganizationDto: OrganizationUpdateDto): Promise<OrganizationReadDto> {
        const organization = await this.organizationRepository.findOne({ where: { id: _id } });
        if (!organization) {
            throw new NotFoundException(`Организация с ID ${_id} не найдена`);
        }
        // Обновить свойства, если они указаны в DTO
        if (updateOrganizationDto.organizationName) organization.organizationName = updateOrganizationDto.organizationName;
        if (updateOrganizationDto.parentOrganizationId) organization.parentOrganizationId = updateOrganizationDto.parentOrganizationId;

        return this.organizationRepository.save(organization);
    }

}