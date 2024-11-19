import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { WinstonModule } from 'nest-winston';
import { ProjectService } from 'src/application/services/project/project.service';
import { ProjectRepository } from 'src/application/services/project/repository/project.repository';
import { winstonConfig } from 'src/utils/winston-logger';
import { RepositoryFake } from '../account/FakeClasses/repositoryFake';
import { Project, Type } from 'src/domains/project.entity';
import {
  Target,
  Type as TypeTarget,
  State as TargetState,
} from 'src/domains/target.entity';
import { faker } from '@faker-js/faker/.';
import { TargetCreateDto } from 'src/contracts/target/create-target.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ProjectCreateDto } from 'src/contracts/project/create-project.dto';
import { State, Strategy } from 'src/domains/strategy.entity';
import { Organization, ReportDay } from 'src/domains/organization.entity';
import { ProjectReadDto } from 'src/contracts/project/read-project.dto';
import { Account } from 'src/domains/account.entity';
import { IsNull } from 'typeorm';

describe('ProjectService', () => {
  let projectService: ProjectService;
  let projectRepository: ProjectRepository;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [WinstonModule.forRoot(winstonConfig)],
      providers: [
        ProjectService,
        {
          provide: getRepositoryToken(Project),
          useClass: RepositoryFake,
        },
      ],
    }).compile();
    projectService = module.get(ProjectService);
    projectRepository = module.get(getRepositoryToken(Project));
  });

  describe('finding all projects by organization', () => {
    it('returns all projects by organization', async () => {
      const organization: Organization = {
        id: faker.string.uuid(),
        organizationName: faker.company.name(),
        parentOrganizationId: null,
        reportDay: ReportDay.FRIDAY,
        createdAt: new Date(),
        updatedAt: new Date(),
        goal: null,
        users: null,
        posts: null,
        policies: null,
        projects: null,
        strategies: null,
        account: null,
      };

      const baseTask = {
        orderNumber: 1,
        content: 'Контент задачи',
        holderUserId: '3b809c42-2824-46c1-9686-dd666403402a',
        dateStart: new Date('2024-09-18T14:59:47.010Z'),
        deadline: new Date('2024-09-18T14:59:47.010Z'),
        holderUser: null,
        project: null,
      };
      const targets: Target[] = [
        TypeTarget.PRODUCT,
        TypeTarget.COMMON,
        TypeTarget.RULE,
        TypeTarget.STATISTIC,
        TypeTarget.EVENT,
      ].map((type) => ({
        ...baseTask,
        type,
        id: faker.string.uuid(),
        targetState: TargetState.ACTIVE,
        dateComplete: new Date('2024-09-18T14:59:47.010Z'),
        createdAt: new Date('2024-09-18T14:59:47.010Z'),
        updatedAt: new Date('2024-09-18T14:59:47.010Z'),
        targetHolders: null,
        isExpired: true,
      }));
      const existingProjects: ProjectReadDto[] = [
        {
          id: faker.string.uuid(),
          projectNumber: faker.number.int(),
          projectName: faker.book.title(),
          programId: faker.string.uuid(),
          content: faker.string.sample(),
          type: Type.PROJECT,
          createdAt: new Date(),
          updatedAt: new Date(),
          organization: organization,
          targets: targets,
          strategy: null,
          account: null,
          user: null,
        },
        {
          id: faker.string.uuid(),
          projectNumber: faker.number.int(),
          projectName: faker.book.title(),
          programId: faker.string.uuid(),
          content: faker.string.sample(),
          type: Type.PROJECT,
          createdAt: new Date(),
          updatedAt: new Date(),
          organization: organization,
          targets: targets,
          strategy: null,
          account: null,
          user: null,
        },
      ];

      const projectRepositoryFindAllSpy = jest
        .spyOn(projectRepository, 'find')
        .mockResolvedValue(existingProjects);

      const result = await projectService.findAllForOrganization(
        organization.id,
      );
      expect(result).toEqual(existingProjects);
      expect(projectRepositoryFindAllSpy).toHaveBeenCalledWith({
        where: { organization: { id: organization.id } },
        relations: ['targets'],
      });
    });
  });

  describe('finding all programs by account', () => {
    it('returns all programs by account', async () => {
      const account: Account = {
        id: faker.string.uuid(),
        accountName: faker.company.name(),
        tenantId: faker.string.uuid(),
        createdAt: new Date(),
        updatedAt: new Date(),
        users: null,
        organizations: null,
        goals: null,
        objectives: null,
        policies: null,
        projects: null,
        strategies: null,
        posts: null,
        statistics: null,
        roleSettings: null,
        policyDirectories: null,
        converts: null,
        groups: null,
      };

      const baseTask = {
        orderNumber: 1,
        content: 'Контент задачи',
        holderUserId: '3b809c42-2824-46c1-9686-dd666403402a',
        dateStart: new Date('2024-09-18T14:59:47.010Z'),
        deadline: new Date('2024-09-18T14:59:47.010Z'),
        holderUser: null,
        project: null,
      };
      const targets: Target[] = [
        TypeTarget.PRODUCT,
        TypeTarget.COMMON,
        TypeTarget.RULE,
        TypeTarget.STATISTIC,
        TypeTarget.EVENT,
      ].map((type) => ({
        ...baseTask,
        type,
        id: faker.string.uuid(),
        targetState: TargetState.ACTIVE,
        dateComplete: new Date('2024-09-18T14:59:47.010Z'),
        createdAt: new Date('2024-09-18T14:59:47.010Z'),
        updatedAt: new Date('2024-09-18T14:59:47.010Z'),
        targetHolders: null,
        isExpired: true,
      }));
      const existingPrograms: ProjectReadDto[] = [
        {
          id: faker.string.uuid(),
          projectNumber: faker.number.int(),
          projectName: faker.book.title(),
          programId: faker.string.uuid(),
          content: faker.string.sample(),
          type: Type.PROGRAM,
          createdAt: new Date(),
          updatedAt: new Date(),
          organization: null,
          targets: targets,
          strategy: null,
          account: account,
          user: null,
        },
        {
          id: faker.string.uuid(),
          projectNumber: faker.number.int(),
          projectName: faker.book.title(),
          programId: faker.string.uuid(),
          content: faker.string.sample(),
          type: Type.PROGRAM,
          createdAt: new Date(),
          updatedAt: new Date(),
          organization: null,
          targets: targets,
          strategy: null,
          account: account,
          user: null,
        },
      ];

      const projectRepositoryFindAllSpy = jest
        .spyOn(projectRepository, 'find')
        .mockResolvedValue(existingPrograms);

      const result = await projectService.findAllProgramsForAccount(account);
      expect(result).toEqual(existingPrograms);
      expect(projectRepositoryFindAllSpy).toHaveBeenCalledWith({
        where: { type: Type.PROGRAM, account: { id: account.id } },
        relations: ['organization', 'targets'],
      });
    });
  });

  describe('finding all project without program by account', () => {
    it('returns all project without program by account', async () => {
      const account: Account = {
        id: faker.string.uuid(),
        accountName: faker.company.name(),
        tenantId: faker.string.uuid(),
        createdAt: new Date(),
        updatedAt: new Date(),
        users: null,
        organizations: null,
        goals: null,
        objectives: null,
        policies: null,
        projects: null,
        strategies: null,
        posts: null,
        statistics: null,
        roleSettings: null,
        policyDirectories: null,
        converts: null,
        groups: null,
      };

      const baseTask = {
        orderNumber: 1,
        content: 'Контент задачи',
        holderUserId: '3b809c42-2824-46c1-9686-dd666403402a',
        dateStart: new Date('2024-09-18T14:59:47.010Z'),
        deadline: new Date('2024-09-18T14:59:47.010Z'),
        holderUser: null,
        project: null,
      };
      const targets: Target[] = [
        TypeTarget.PRODUCT,
        TypeTarget.COMMON,
        TypeTarget.RULE,
        TypeTarget.STATISTIC,
        TypeTarget.EVENT,
      ].map((type) => ({
        ...baseTask,
        type,
        id: faker.string.uuid(),
        targetState: TargetState.ACTIVE,
        dateComplete: new Date('2024-09-18T14:59:47.010Z'),
        createdAt: new Date('2024-09-18T14:59:47.010Z'),
        updatedAt: new Date('2024-09-18T14:59:47.010Z'),
        targetHolders: null,
        isExpired: true,
      }));
      const existingProjects: ProjectReadDto[] = [
        {
          id: faker.string.uuid(),
          projectNumber: faker.number.int(),
          projectName: faker.book.title(),
          programId: null,
          content: faker.string.sample(),
          type: Type.PROJECT,
          createdAt: new Date(),
          updatedAt: new Date(),
          organization: null,
          targets: targets,
          strategy: null,
          account: account,
          user: null,
        },
        {
          id: faker.string.uuid(),
          projectNumber: faker.number.int(),
          projectName: faker.book.title(),
          programId: null,
          content: faker.string.sample(),
          type: Type.PROGRAM,
          createdAt: new Date(),
          updatedAt: new Date(),
          organization: null,
          targets: targets,
          strategy: null,
          account: account,
          user: null,
        },
      ];

      const projectRepositoryFindAllSpy = jest
        .spyOn(projectRepository, 'find')
        .mockResolvedValue(existingProjects);

      const result =
        await projectService.findAllProjectsWithoutProgramForAccount(account);
      expect(result).toEqual(existingProjects);
      expect(projectRepositoryFindAllSpy).toHaveBeenCalledWith({
        where: {
          type: Type.PROJECT,
          programId: IsNull(),
          account: { id: account.id },
        },
        relations: ['organization', 'targets'],
      });
    });
  });

  // describe('finding a project by id', () => {
  //     it('throws an error when a goal doesnt exist', async () => {
  //         const projectId = faker.string.uuid();

  //         const projectRepositoryFindOneSpy = jest
  //             .spyOn(projectRepository, 'createQueryBuilder')
  //             .mockResolvedValue(null);

  //         expect.assertions(3);

  //         try {
  //             await goalService.findOneById(goalId, ['organization']);
  //         } catch (e) {
  //             expect(e).toBeInstanceOf(NotFoundException);
  //             expect(e.message).toBe(`Цель с ID: ${goalId} не найдена!`);
  //         }

  //         expect(goalRepositoryFindOneSpy).toHaveBeenCalledWith({
  //             where: { id: goalId },
  //             relations: ['organization'],
  //         });
  //     });

  describe('finding a program by id', () => {
    it('throws an error when a program doesnt exist', async () => {
      const id = faker.string.uuid();

      const projectRepositoryFindOneSpy = jest
        .spyOn(projectRepository, 'findOne')
        .mockResolvedValue(null);

      expect.assertions(3);

      try {
        await projectService.findOneProgramById(id);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toBe(`Проект с ID: ${id} не найден`);
      }

      expect(projectRepositoryFindOneSpy).toHaveBeenCalledWith({
        where: { id: id },
        relations: ['targets.targetHolders.user', 'organization', 'strategy'],
      });
    });

    it('returns the found program', async () => {
      const id = faker.string.uuid();

      const baseTask = {
        orderNumber: 1,
        content: 'Контент задачи',
        holderUserId: '3b809c42-2824-46c1-9686-dd666403402a',
        dateStart: new Date('2024-09-18T14:59:47.010Z'),
        deadline: new Date('2024-09-18T14:59:47.010Z'),
        holderUser: null,
        project: null,
      };
      const targets: Target[] = [
        TypeTarget.PRODUCT,
        TypeTarget.COMMON,
        TypeTarget.RULE,
        TypeTarget.STATISTIC,
        TypeTarget.EVENT,
      ].map((type) => ({
        ...baseTask,
        type,
        id: faker.string.uuid(),
        targetState: TargetState.ACTIVE,
        dateComplete: new Date('2024-09-18T14:59:47.010Z'),
        createdAt: new Date('2024-09-18T14:59:47.010Z'),
        updatedAt: new Date('2024-09-18T14:59:47.010Z'),
        targetHolders: null,
      }));

      const existingProgram: ProjectReadDto = {
        id: id,
        projectNumber: faker.number.int(),
        projectName: faker.book.title(),
        programId: faker.string.uuid(),
        content: faker.string.sample(),
        type: Type.PROGRAM,
        createdAt: new Date(),
        updatedAt: new Date(),
        organization: null,
        targets: targets.map((target) => ({
          ...target,
          isExpired: target.deadline
            ? new Date(target.deadline) < new Date()
            : false,
        })),
        strategy: null,
        account: null,
        user: null,
      };

      const projectRepositoryFindOneSpy = jest
        .spyOn(projectRepository, 'findOne')
        .mockResolvedValue(existingProgram);

      const result = await projectService.findOneProgramById(id);
      expect(result).toEqual(existingProgram);
      expect(projectRepositoryFindOneSpy).toHaveBeenCalledWith({
        where: { id: id },
        relations: ['targets.targetHolders.user', 'organization', 'strategy'],
      });
    });
  });

  describe('finding all projects by programId', () => {
    it('returns all projects by programId', async () => {
      const programId = faker.string.uuid();

      const baseTask = {
        orderNumber: 1,
        content: 'Контент задачи',
        holderUserId: '3b809c42-2824-46c1-9686-dd666403402a',
        dateStart: new Date('2024-09-18T14:59:47.010Z'),
        deadline: new Date('2024-09-18T14:59:47.010Z'),
        holderUser: null,
        project: null,
      };
      const targets: Target[] = [
        TypeTarget.PRODUCT,
        TypeTarget.COMMON,
        TypeTarget.RULE,
        TypeTarget.STATISTIC,
        TypeTarget.EVENT,
      ].map((type) => ({
        ...baseTask,
        type,
        id: faker.string.uuid(),
        targetState: TargetState.ACTIVE,
        dateComplete: new Date('2024-09-18T14:59:47.010Z'),
        createdAt: new Date('2024-09-18T14:59:47.010Z'),
        updatedAt: new Date('2024-09-18T14:59:47.010Z'),
        targetHolders: {} as any,
        isExpired: true,
      }));
      const existingProjects: ProjectReadDto[] = [
        {
          id: faker.string.uuid(),
          projectNumber: faker.number.int(),
          projectName: faker.book.title(),
          programId: programId,
          content: faker.string.sample(),
          type: Type.PROJECT,
          createdAt: new Date(),
          updatedAt: new Date(),
          organization: null,
          targets: targets,
          strategy: null,
          account: null,
          user: null,
        },
        {
          id: faker.string.uuid(),
          projectNumber: faker.number.int(),
          projectName: faker.book.title(),
          programId: programId,
          content: faker.string.sample(),
          type: Type.PROJECT,
          createdAt: new Date(),
          updatedAt: new Date(),
          organization: null,
          targets: targets,
          strategy: null,
          account: null,
          user: null,
        },
      ];

      const projectRepositoryFindAllSpy = jest
        .spyOn(projectRepository, 'find')
        .mockResolvedValue(existingProjects);

      const result = await projectService.findAllProjectsByProgramId(programId);
      expect(result).toEqual(existingProjects);
      expect(projectRepositoryFindAllSpy).toHaveBeenCalledWith({
        where: { programId: programId },
        relations: ['targets.targetHolders.user'],
      });
    });
  });

  describe('creating a project', () => {
    it('calls the repository with correct paramaters', async () => {
      const projectName = faker.book.title();
      const programId = faker.string.uuid();
      const content = faker.string.sample();
      const type = Type.PROJECT;
      const organizationId = faker.string.uuid();
      const strategyId = faker.string.uuid();

      const organization: Organization = {
        id: organizationId,
        organizationName: faker.company.name(),
        parentOrganizationId: null,
        reportDay: ReportDay.FRIDAY,
        createdAt: new Date(),
        updatedAt: new Date(),
        goal: null,
        users: null,
        posts: null,
        policies: null,
        projects: null,
        strategies: null,
        account: null,
      };

      const strategy: Strategy = {
        id: strategyId,
        strategyNumber: faker.number.int(),
        dateActive: new Date(),
        content: faker.animal.bear(),
        state: State.ACTIVE,
        createdAt: new Date(),
        updatedAt: new Date(),
        user: null,
        account: null,
        organization: organization,
        objective: null,
        projects: null,
      };

      const baseTask = {
        orderNumber: 1,
        content: 'Контент задачи',
        holderUserId: '3b809c42-2824-46c1-9686-dd666403402a',
        dateStart: new Date('2024-09-18T14:59:47.010Z'),
        deadline: new Date('2024-09-18T14:59:47.010Z'),
        holderUser: null,
        project: null,
      };

      const targetCreateDtos: TargetCreateDto[] = [
        TypeTarget.PRODUCT,
        TypeTarget.COMMON,
        TypeTarget.RULE,
        TypeTarget.STATISTIC,
        TypeTarget.EVENT,
      ].map((type) => ({ ...baseTask, type }));

      const targets: Target[] = [
        TypeTarget.PRODUCT,
        TypeTarget.COMMON,
        TypeTarget.RULE,
        TypeTarget.STATISTIC,
        TypeTarget.EVENT,
      ].map((type) => ({
        ...baseTask,
        type,
        id: faker.string.uuid(),
        targetState: TargetState.ACTIVE,
        dateComplete: new Date('2024-09-18T14:59:47.010Z'),
        createdAt: new Date('2024-09-18T14:59:47.010Z'),
        updatedAt: new Date('2024-09-18T14:59:47.010Z'),
        targetHolders: null,
      }));

      const projectCreateDto: ProjectCreateDto = {
        projectName: projectName,
        programId: programId,
        content: content,
        type: type,
        organizationId: organizationId,
        strategyId: strategyId,
        targetCreateDtos: targetCreateDtos,
        user: null,
        strategy: strategy,
        account: null,
        organization: organization,
      };
      const savedProject: Project = {
        id: faker.string.uuid(),
        projectNumber: faker.number.int(),
        projectName: projectName,
        programId: programId,
        content: content,
        type: type,
        createdAt: new Date(),
        updatedAt: new Date(),
        organization: organization,
        targets: targets,
        strategy: strategy,
        account: null,
        user: null,
      };
      const projectRepositoryInsertSpy = jest
        .spyOn(projectRepository, 'insert')
        .mockResolvedValue({
          identifiers: [{ id: savedProject.id }],
          generatedMaps: [],
          raw: [],
        });

      const result = await projectService.create(projectCreateDto);

      expect(projectRepositoryInsertSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          projectName: projectName,
          programId: programId,
          content: content,
          type: type,
          user: null,
          strategy: strategy,
          account: null,
          organization: organization,
        }),
      );
      expect(result).toEqual(savedProject.id);
    });
  });

  describe('updating a project', () => {
    it('calls the repository with correct paramaters', async () => {
      const _id = faker.string.uuid();
      const projectName = faker.book.title();
      const programId = faker.string.uuid();
      const content = faker.string.sample();
      const type = Type.PROJECT;
      const organizationId = faker.string.uuid();
      const strategyId = faker.string.uuid();
      //   targetCreateDtos?: TargetCreateDto[];
      //   targetUpdateDtos?: TargetUpdateDto[];

      const organization: Organization = {
        id: organizationId,
        organizationName: faker.company.name(),
        parentOrganizationId: null,
        reportDay: ReportDay.FRIDAY,
        createdAt: new Date(),
        updatedAt: new Date(),
        goal: null,
        users: null,
        posts: null,
        policies: null,
        projects: null,
        strategies: null,
        account: null,
      };

      const strategy: Strategy = {
        id: strategyId,
        strategyNumber: faker.number.int(),
        dateActive: new Date(),
        content: faker.animal.bear(),
        state: State.ACTIVE,
        createdAt: new Date(),
        updatedAt: new Date(),
        user: null,
        account: null,
        organization: organization,
        objective: null,
        projects: null,
      };

      const baseTask = {
        orderNumber: 1,
        content: 'Контент задачи',
        holderUserId: '3b809c42-2824-46c1-9686-dd666403402a',
        dateStart: new Date('2024-09-18T14:59:47.010Z'),
        deadline: new Date('2024-09-18T14:59:47.010Z'),
        holderUser: null,
        project: null,
      };

      const targetCreateDtos: TargetCreateDto[] = [
        TypeTarget.PRODUCT,
        TypeTarget.COMMON,
        TypeTarget.RULE,
        TypeTarget.STATISTIC,
        TypeTarget.EVENT,
      ].map((type) => ({ ...baseTask, type }));

      const targets: Target[] = [
        TypeTarget.PRODUCT,
        TypeTarget.COMMON,
        TypeTarget.RULE,
        TypeTarget.STATISTIC,
        TypeTarget.EVENT,
      ].map((type) => ({
        ...baseTask,
        type,
        id: faker.string.uuid(),
        targetState: TargetState.ACTIVE,
        dateComplete: new Date('2024-09-18T14:59:47.010Z'),
        createdAt: new Date('2024-09-18T14:59:47.010Z'),
        updatedAt: new Date('2024-09-18T14:59:47.010Z'),
        targetHolders: null,
      }));

      const projectCreateDto: ProjectCreateDto = {
        projectName: projectName,
        programId: programId,
        content: content,
        type: type,
        organizationId: organizationId,
        strategyId: strategyId,
        targetCreateDtos: targetCreateDtos,
        user: null,
        strategy: strategy,
        account: null,
        organization: organization,
      };
      const savedProject: Project = {
        id: faker.string.uuid(),
        projectNumber: faker.number.int(),
        projectName: projectName,
        programId: programId,
        content: content,
        type: type,
        createdAt: new Date(),
        updatedAt: new Date(),
        organization: organization,
        targets: targets,
        strategy: strategy,
        account: null,
        user: null,
      };
      const projectRepositoryInsertSpy = jest
        .spyOn(projectRepository, 'insert')
        .mockResolvedValue({
          identifiers: [{ id: savedProject.id }],
          generatedMaps: [],
          raw: [],
        });

      const result = await projectService.create(projectCreateDto);

      expect(projectRepositoryInsertSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          projectName: projectName,
          programId: programId,
          content: content,
          type: type,
          user: null,
          strategy: strategy,
          account: null,
          organization: organization,
        }),
      );
      expect(result).toEqual(savedProject.id);
    });
  });
});
