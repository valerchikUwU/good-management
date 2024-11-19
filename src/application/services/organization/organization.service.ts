import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { OrganizationRepository } from './repository/organization.repository';
import { OrganizationReadDto } from 'src/contracts/organization/read-organization.dto';
import { OrganizationCreateDto } from 'src/contracts/organization/create-organization.dto';
import { Organization } from 'src/domains/organization.entity';
import { AccountReadDto } from 'src/contracts/account/read-account.dto';
import { OrganizationUpdateDto } from 'src/contracts/organization/update-organization.dto';
import { Logger } from 'winston';
import { IsNull, Not } from 'typeorm';
import { State } from 'src/domains/strategy.entity';

@Injectable()
export class OrganizationService {
  constructor(
    private readonly organizationRepository: OrganizationRepository,
    @Inject('winston') private readonly logger: Logger,
  ) {}

  async findAllForAccount(
    account: AccountReadDto,
    relations?: string[],
  ): Promise<OrganizationReadDto[]> {
    try {
      const organizations = await this.organizationRepository.find({
        where: { account: { id: account.id } },
        relations: relations !== undefined ? relations : [],
      });
      return organizations.map((organization) => ({
        id: organization.id,
        organizationName: organization.organizationName,
        parentOrganizationId: organization.parentOrganizationId,
        reportDay: organization.reportDay,
        createdAt: organization.createdAt,
        updatedAt: organization.updatedAt,
        users: organization.users,
        posts: organization.posts,
        goal: organization.goal,
        policies: organization.policies,
        projects: organization.projects,
        strategies: organization.strategies,
        account: organization.account,
      }));
    } catch (err) {
      this.logger.error(err);
      // Обработка других ошибок
      throw new InternalServerErrorException(
        'Ошибка при получении всех организаций!',
      );
    }
  }

  async findAllWithoutGoalsForAccount(account: AccountReadDto): Promise<OrganizationReadDto[]> {
    try {
      const organizations = await this.organizationRepository.find({
        where: { account: { id: account.id }, goal: { id: IsNull() } },
        relations: ['goal'],
      });
      return organizations.map((organization) => ({
        id: organization.id,
        organizationName: organization.organizationName,
        parentOrganizationId: organization.parentOrganizationId,
        reportDay: organization.reportDay,
        createdAt: organization.createdAt,
        updatedAt: organization.updatedAt,
        users: organization.users,
        posts: organization.posts,
        goal: organization.goal,
        policies: organization.policies,
        projects: organization.projects,
        strategies: organization.strategies,
        account: organization.account,
      }));
    } catch (err) {
      this.logger.error(err);
      // Обработка других ошибок
      throw new InternalServerErrorException(
        'Ошибка при получении всех организаций!',
      );
    }
  }

  async findAllWithGoalsForAccount(account: AccountReadDto): Promise<OrganizationReadDto[]> {
    try {
      const organizations = await this.organizationRepository.find({
        where: { account: { id: account.id }, goal: { id: Not(IsNull()) } },
        relations: ['goal'],
      });
      return organizations.map((organization) => ({
        id: organization.id,
        organizationName: organization.organizationName,
        parentOrganizationId: organization.parentOrganizationId,
        reportDay: organization.reportDay,
        createdAt: organization.createdAt,
        updatedAt: organization.updatedAt,
        users: organization.users,
        posts: organization.posts,
        goal: organization.goal,
        policies: organization.policies,
        projects: organization.projects,
        strategies: organization.strategies,
        account: organization.account,
      }));
    } catch (err) {
      this.logger.error(err);
      // Обработка других ошибок
      throw new InternalServerErrorException(
        'Ошибка при получении всех организаций!',
      );
    }
  }

  async findAllWithDraftStrategyForAccount(account: AccountReadDto): Promise<OrganizationReadDto[]> {
    try {
      const organizations = await this.organizationRepository.find({
        where: {
          account: { id: account.id },
          strategies: { state: State.DRAFT },
        },
        relations: ['strategies'],
      });
      return organizations.map((organization) => ({
        id: organization.id,
        organizationName: organization.organizationName,
        parentOrganizationId: organization.parentOrganizationId,
        reportDay: organization.reportDay,
        createdAt: organization.createdAt,
        updatedAt: organization.updatedAt,
        users: organization.users,
        posts: organization.posts,
        goal: organization.goal,
        policies: organization.policies,
        projects: organization.projects,
        strategies: organization.strategies,
        account: organization.account,
      }));
    } catch (err) {
      this.logger.error(err);
      // Обработка других ошибок
      throw new InternalServerErrorException(
        'Ошибка при получении всех организаций!',
      );
    }
  }

  async findAllWithoutDraftStrategyForAccount(account: AccountReadDto): Promise<OrganizationReadDto[]> {
    try {
      const organizations = await this.organizationRepository
        .createQueryBuilder('organization')
        .leftJoin('organization.strategies', 'strategy')
        .where('organization.accountId = :accountId', { accountId: account.id })
        .andWhere(
          'NOT EXISTS (SELECT 1 FROM strategy WHERE strategy.organizationId = organization.id AND strategy.state = :state)',
          { state: State.DRAFT },
        )
        .getMany();
      return organizations.map((organization) => ({
        id: organization.id,
        organizationName: organization.organizationName,
        parentOrganizationId: organization.parentOrganizationId,
        reportDay: organization.reportDay,
        createdAt: organization.createdAt,
        updatedAt: organization.updatedAt,
        users: organization.users,
        posts: organization.posts,
        goal: organization.goal,
        policies: organization.policies,
        projects: organization.projects,
        strategies: organization.strategies,
        account: organization.account,
      }));
    } catch (err) {
      this.logger.error(err);
      // Обработка других ошибок
      throw new InternalServerErrorException(
        'Ошибка при получении всех организаций!',
      );
    }
  }

  async findOneById(id: string, relations?: string[]): Promise<OrganizationReadDto> {
    try {
      const organization = await this.organizationRepository.findOne({
        where: { id: id },
        relations: relations !== undefined ? relations : [],
      });

      if (!organization)
        throw new NotFoundException(`Организация с ID: ${id} не найдена`);
      const organizationReadDto: OrganizationReadDto = {
        id: organization.id,
        organizationName: organization.organizationName,
        parentOrganizationId: organization.parentOrganizationId,
        reportDay: organization.reportDay,
        createdAt: organization.createdAt,
        updatedAt: organization.updatedAt,
        users: organization.users,
        posts: organization.posts,
        goal: organization.goal,
        policies: organization.policies,
        projects: organization.projects,
        strategies: organization.strategies,
        account: organization.account,
      };

      return organizationReadDto;
    } catch (err) {
      this.logger.error(err);
      // Обработка специфичных исключений
      if (err instanceof NotFoundException) {
        throw err; // Пробрасываем исключение дальше
      }

      // Обработка других ошибок
      throw new InternalServerErrorException(
        'Ошибка при получении организации',
      );
    }
  }

  async create(organizationCreateDto: OrganizationCreateDto): Promise<string> {
    try {
      // Проверка на наличие обязательных данных
      if (!organizationCreateDto.organizationName) {
        throw new BadRequestException('У организации должно быть название!');
      }
      const organization = new Organization();
      if (organizationCreateDto.id) organization.id = organizationCreateDto.id;
      organization.organizationName = organizationCreateDto.organizationName;
      if (organizationCreateDto.parentOrganizationId)
        organization.parentOrganizationId =
          organizationCreateDto.parentOrganizationId;
      if (organizationCreateDto.reportDay)
        organization.reportDay = organizationCreateDto.reportDay;
      organization.account = organizationCreateDto.account;
      const createdOrganizationId =
        await this.organizationRepository.insert(organization);
      return createdOrganizationId.identifiers[0].id;
    } catch (err) {
      this.logger.error(err);
      // Обработка специфичных исключений
      if (err instanceof BadRequestException) {
        throw err; // Пробрасываем исключение дальше
      }
      throw new InternalServerErrorException('Ошибка при создании организации');
    }
  }

  async update(_id: string, updateOrganizationDto: OrganizationUpdateDto): Promise<string> {
    try {
      const organization = await this.organizationRepository.findOne({
        where: { id: _id },
      });
      if (!organization) {
        throw new NotFoundException(`Организация с ID ${_id} не найдена`);
      }
      // Обновить свойства, если они указаны в DTO
      if (updateOrganizationDto.organizationName)
        organization.organizationName = updateOrganizationDto.organizationName;
      if (updateOrganizationDto.parentOrganizationId)
        organization.parentOrganizationId =
          updateOrganizationDto.parentOrganizationId;
      if (updateOrganizationDto.reportDay)
        organization.reportDay = updateOrganizationDto.reportDay;
      await this.organizationRepository.update(_id, {
        organizationName: organization.organizationName,
        parentOrganizationId: organization.parentOrganizationId,
        reportDay: organization.reportDay,
      });
      return organization.id;
    } catch (err) {
      this.logger.error(err);
      // Обработка специфичных исключений
      if (err instanceof NotFoundException) {
        throw err; // Пробрасываем исключение дальше
      }

      // Обработка других ошибок
      throw new InternalServerErrorException(
        'Ошибка при обновлении организации',
      );
    }
  }
}
