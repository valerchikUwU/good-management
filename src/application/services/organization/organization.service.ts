import { Injectable } from "@nestjs/common";
import { OrganizationRepository } from "./repository/organization.repository";
import { OrganizationReadDto } from "src/contracts/organization/read-organization.dto";
import { OrganizationCreateDto } from "src/contracts/organization/create-organization.dto";
import { Organization } from "src/domains/organization.entity";


@Injectable()
export class OrganizationService {
    constructor(private readonly organizationRepository: OrganizationRepository) {

    }

    async findAll(): Promise<OrganizationReadDto[]> {
        const organizations = await this.organizationRepository.find();
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

}