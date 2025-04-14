import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Project, Type } from 'src/domains/project.entity';
import { ProjectRepository } from './repository/project.repository';
import { ProjectReadDto } from 'src/contracts/project/read-project.dto';
import { ProjectCreateDto } from 'src/contracts/project/create-project.dto';
import { Logger } from 'winston';
import { ProjectUpdateDto } from 'src/contracts/project/update-project.dto';
import { DataSource, In, IsNull, Not } from 'typeorm';
import { State, Target, Type as TypeTarget } from 'src/domains/target.entity';
import { TargetService } from '../target/target.service';
import { Post } from 'src/domains/post.entity';
import { TargetHolderCreateDto } from 'src/contracts/targetHolder/create-targetHolder.dto';
import { TargetHolder } from 'src/domains/targetHolder.entity';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: ProjectRepository,
    private readonly targetService: TargetService,
    @Inject('winston') private readonly logger: Logger,
    private dataSource: DataSource
  ) { }

  async findAllForOrganization(organizationId: string, relations?: string[]): Promise<ProjectReadDto[]> {
    try {
      const projects = await this.projectRepository.find({
        where: { organization: { id: organizationId } },
        relations: relations ?? [],
      });

      return projects.map((project) => ({
        id: project.id,
        projectNumber: project.projectNumber,
        projectName: project.projectName,
        programId: project.programId,
        content: project.content,
        type: project.type,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
        organization: project.organization,
        targets: project.targets,
        strategy: project.strategy,
        account: project.account,
        user: project.user,
      }));
    } catch (err) {
      this.logger.error(err);
      // Обработка других ошибок
      throw new InternalServerErrorException(
        'Ошибка при получении всех проектов!',
      );
    }
  }

  async findAllProgramsForOrganization(organizationId: string, relations?: string[]): Promise<ProjectReadDto[]> {
    try {
      const programs = await this.projectRepository.find({
        where: { type: Type.PROGRAM, organization: { id: organizationId } },
        relations: relations ?? [],
      });

      return programs.map((program) => ({
        id: program.id,
        projectNumber: program.projectNumber,
        projectName: program.projectName,
        programId: program.programId,
        content: program.content,
        type: program.type,
        createdAt: program.createdAt,
        updatedAt: program.updatedAt,
        organization: program.organization,
        targets: program.targets.map((target) => ({
          ...target,
          isExpired: target.deadline ? new Date(target.deadline) < new Date() && target.targetState !== State.FINISHED : false,
        })),
        strategy: program.strategy,
        account: program.account,
        user: program.user,
      }));
    } catch (err) {
      this.logger.error(err);
      // Обработка других ошибок
      throw new InternalServerErrorException(
        'Ошибка при получении всех програм!',
      );
    }
  }

  async findAllProjectsWithoutProgramForOrganization(organizationId: string, relations?: string[]): Promise<ProjectReadDto[]> {
    try {
      const projects = await this.projectRepository.find({
        where: {
          type: Type.PROJECT,
          programId: IsNull(),
          organization: { id: organizationId },
        },
        relations: relations ?? [],
      });

      return projects.map((project) => ({
        id: project.id,
        projectNumber: project.projectNumber,
        projectName: project.projectName,
        programId: project.programId,
        content: project.content,
        type: project.type,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
        organization: project.organization,
        targets: project.targets.map((target) => ({
          ...target,
          isExpired: target.deadline ? new Date(target.deadline) < new Date() && target.targetState !== State.FINISHED : false,
        })),
        strategy: project.strategy,
        account: project.account,
        user: project.user,
      }));
    } catch (err) {
      this.logger.error(err);
      // Обработка других ошибок
      throw new InternalServerErrorException(
        'Ошибка при получении всех проектов!',
      );
    }
  }

  async findOneById(id: string, relations?: string[]): Promise<ProjectReadDto> {
    try {
      const project = await this.projectRepository.findOne({
        where: { id: id },
        relations: relations ?? []
      })

      if (!project) throw new NotFoundException(`Проект с ID: ${id} не найден`);

      let program: ProjectReadDto;
      if (project.programId !== null) {
        program = await this.projectRepository.findOne({
          where: { id: project.programId },
        });
      } else {
        program = null;
      }

      const projectReadDto: ProjectReadDto = {
        id: project.id,
        projectNumber: project.projectNumber,
        projectName: project.projectName,
        programId: project.programId,
        programNumber: program !== null ? program.projectNumber : null,
        content: project.content,
        type: project.type,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
        organization: project.organization,
        targets: relations !== undefined ? project.targets.map((target) => ({
          ...target,
          isExpired: target.deadline ? new Date(target.deadline) < new Date() && target.targetState !== State.FINISHED : false,
        })) : project.targets,
        strategy: project.strategy,
        account: project.account,
        user: project.user,
      };
      return projectReadDto;
    } catch (err) {
      console.log(err)
      this.logger.error(err);
      // Обработка специфичных исключений
      if (err instanceof NotFoundException) {
        throw err; // Пробрасываем исключение дальше
      }

      // Обработка других ошибок
      throw new InternalServerErrorException('Ошибка при получении проекта');
    }
  }

  async findOneProgramById(id: string): Promise<ProjectReadDto> {
    try {
      const program = await this.projectRepository.findOne({
        where: { id: id },
        relations: ['targets.targetHolders.post', 'strategy', 'organization'],
      });
      if (!program) throw new NotFoundException(`Проект с ID: ${id} не найден`);
      const programReadDto: ProjectReadDto = {
        id: program.id,
        projectNumber: program.projectNumber,
        projectName: program.projectName,
        programId: program.programId,
        content: program.content,
        type: program.type,
        createdAt: program.createdAt,
        updatedAt: program.updatedAt,
        organization: program.organization,
        targets: program.targets.map((target) => ({
          ...target,
          isExpired: target.deadline ? new Date(target.deadline) < new Date() && target.targetState !== State.FINISHED : false,
        })),
        strategy: program.strategy,
        account: program.account,
        user: program.user,
      };

      return programReadDto;
    } catch (err) {
      this.logger.error(err);
      // Обработка специфичных исключений
      if (err instanceof NotFoundException) {
        throw err; // Пробрасываем исключение дальше
      }

      // Обработка других ошибок
      throw new InternalServerErrorException('Ошибка при получении проекта');
    }
  }

  async findAllNotRejectedProjectsByProgramIdForOrganization(programId: string, organizationId: string): Promise<ProjectReadDto[]> {
    try {
      const projects = await this.projectRepository
        .createQueryBuilder('project')
        .leftJoinAndSelect('project.targets', 'target')
        .leftJoinAndSelect('target.targetHolders', 'targetHolder')
        .leftJoinAndSelect('targetHolder.post', 'post')
        .where('project.programId = :programId', { programId })
        .andWhere('target.type = :targetType', { targetType: TypeTarget.PRODUCT })
        .andWhere('target.targetState != :rejectedState', { rejectedState: State.REJECTED })
        .andWhere('project.organization.id = :organizationId', { organizationId: organizationId })
        .getMany();
      return projects.map((project) => ({
        id: project.id,
        projectNumber: project.projectNumber,
        projectName: project.projectName,
        programId: project.programId,
        content: project.content,
        type: project.type,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
        organization: project.organization,
        targets: project.targets.map((target) => ({
          ...target,
          isExpired: target.deadline ? new Date(target.deadline) < new Date() && target.targetState !== State.FINISHED : false,
        })),
        strategy: project.strategy,
        account: project.account,
        user: project.user,
      }));
    } catch (err) {
      this.logger.error(err);
      if (err instanceof NotFoundException) {
        throw err;
      }
      throw new InternalServerErrorException('Ошибка при получении проекта');
    }
  }

  async create(projectCreateDto: ProjectCreateDto): Promise<string> {
    try {
      const createdProjectId = await this.dataSource.transaction(async transactionalEntityManager => {
        const project = new Project();
        project.projectName = projectCreateDto.projectName;
        project.content = projectCreateDto.content;
        project.type = projectCreateDto.type;
        project.organization = projectCreateDto.organization;
        project.user = projectCreateDto.user;
        project.account = projectCreateDto.account;
        project.strategy = projectCreateDto.strategy;
        const createdProject = await transactionalEntityManager.save(Project, project);
        const holderPostIds = projectCreateDto.targetCreateDtos
          .map(dto => dto.holderPostId)
          .filter((holderPostId) => holderPostId != null);
        const holderPosts = await transactionalEntityManager.findBy(Post, {
          id: In(holderPostIds),
        });
        const holderPostMap = new Map(holderPosts.map(post => [post.id, post]));
        const targetCreateDtos = projectCreateDto.targetCreateDtos.map(targetCreateDto => {
          targetCreateDto.project = createdProject;
          targetCreateDto.holderPost = targetCreateDto.holderPostId ? holderPostMap.get(targetCreateDto.holderPostId) : null;
          return targetCreateDto;
        });
        const createdTargets: Target[] = await transactionalEntityManager.save(Target, targetCreateDtos);
        const targetHolderCreateDtos: TargetHolderCreateDto[] = [];
        createdTargets.forEach(target => {
          if (target.holderPostId != null) {
            targetHolderCreateDtos.push({
              target: target,
              post: holderPostMap.get(target.holderPostId)
            })
          }
        })
        if (targetHolderCreateDtos.length > 0) {
          await transactionalEntityManager.insert(TargetHolder, targetHolderCreateDtos)
        }
        return createdProject.id
      });
      return createdProjectId

    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException('Ошибка при создании проекта');
    }
  }

  async update(_id: string, updateProjectDto: ProjectUpdateDto): Promise<string> {
    try {

      const updatedProjectId = await this.dataSource.transaction(async (transactionalEntityManager) => {
        const project = await transactionalEntityManager.findOne(Project, {
          where: { id: _id },
          relations: ['strategy'],
        });
        if (!project) {
          throw new NotFoundException(`Проект с ID ${_id} не найден`);
        }
        if (updateProjectDto.projectName)
          project.projectName = updateProjectDto.projectName;
        if (updateProjectDto.programId !== undefined)
          project.programId = updateProjectDto.programId;
        if (updateProjectDto.content)
          project.content = updateProjectDto.content;
        if (updateProjectDto.strategyId != null) {
          project.strategy = updateProjectDto.strategy;
        }
        else if (updateProjectDto.strategyId === null) {
          project.strategy = null
        }
        await transactionalEntityManager.update(Project, project.id, {
          projectName: project.projectName,
          programId: project.programId,
          content: project.content,
          organization: project.organization,
          strategy: project.strategy,
        });

        if (project.type === Type.PROGRAM && updateProjectDto.projectIds) {
          const projectsWithCurrentProgram = await transactionalEntityManager.createQueryBuilder(Project, 'project')
            .leftJoinAndSelect('project.targets', 'targets')
            .where('project.programId = :programId', { programId: project.id })
            .andWhere(qb => {
              const subQuery = qb.subQuery()
                .select('1')
                .from('target', 'subTargets')
                .where('subTargets.projectId = project.id')
                .andWhere('subTargets.type = :type', { type: TypeTarget.PRODUCT })
                .andWhere('subTargets.targetState = :state', { state: State.ACTIVE })
                .getQuery();
              return `EXISTS (${subQuery})`;
            })
            .getMany();
          console.log(projectsWithCurrentProgram)
          let activeProjectsWithCurrentProgramIds = projectsWithCurrentProgram
            .filter((project) =>
              project.targets.some(
                (target) =>
                  new Date(target.deadline) > new Date() &&
                  target.targetState === State.ACTIVE &&
                  target.type === TypeTarget.PRODUCT,
              ),
            )
            .map((project) => project.id);
          console.log(`activeProjectsWithCurrentProgramIds: ${activeProjectsWithCurrentProgramIds}`)
          let expiredProjectsWithCurrentProgramIds = projectsWithCurrentProgram
            .filter((project) =>
              project.targets.some(
                (target) =>
                  new Date(target.deadline) < new Date() &&
                  target.targetState === State.ACTIVE &&
                  target.type === TypeTarget.PRODUCT,
              ),
            )
            .map((project) => project.id);
          console.log(`expiredProjectsWithCurrentProgramIds: ${expiredProjectsWithCurrentProgramIds}`)
          if (activeProjectsWithCurrentProgramIds === undefined)
            activeProjectsWithCurrentProgramIds = [];
          if (expiredProjectsWithCurrentProgramIds === undefined)
            expiredProjectsWithCurrentProgramIds = [];

          const projectIdsToAdd = updateProjectDto.projectIds.filter(
            (id) =>
              !activeProjectsWithCurrentProgramIds.includes(id) &&
              !expiredProjectsWithCurrentProgramIds.includes(id),
          );
          const projectIdsToUpdate = updateProjectDto.projectIds.filter(
            (id) =>
              activeProjectsWithCurrentProgramIds.includes(id)
          );
          const commonArray = activeProjectsWithCurrentProgramIds.concat(expiredProjectsWithCurrentProgramIds);
          const projectIdsToDelete = commonArray.filter(
            (id) => !updateProjectDto.projectIds.includes(id),
          );
          console.log(`projectIdsToAdd: ${projectIdsToAdd}`)
          console.log(`projectIdsToUpdate: ${projectIdsToUpdate}`)
          console.log(`projectIdsToDelete: ${projectIdsToDelete}`)
          if (projectIdsToAdd.length > 0) {
            await transactionalEntityManager.update(Project,
              { id: In(projectIdsToAdd) },
              { programId: project.id, strategy: project.strategy },
            );
          }
          if (projectIdsToUpdate.length > 0) {
            await transactionalEntityManager.update(Project,
              { id: In(projectIdsToUpdate) },
              { strategy: project.strategy },
            );
          }
          if (projectIdsToDelete.length > 0) {
            await transactionalEntityManager.update(Project,
              { id: In(projectIdsToDelete) },
              { programId: null, strategy: null },
            );
          }
        }
        if (updateProjectDto.targetCreateDtos) {
          const holderPostForCreationIds = updateProjectDto.targetCreateDtos
            .map(dto => dto.holderPostId)
            .filter((holderPostId) => holderPostId != null);
          const holderPostsForCreation = await transactionalEntityManager.findBy(Post, {
            id: In(holderPostForCreationIds),
          });
          const holderPostMapForCreation = new Map(holderPostsForCreation.map(post => [post.id, post]));
          const targetCreateDtos = updateProjectDto.targetCreateDtos.map(targetCreateDto => {
            targetCreateDto.project = project;
            targetCreateDto.holderPost = targetCreateDto.holderPostId ? holderPostMapForCreation.get(targetCreateDto.holderPostId) : null;
            return targetCreateDto;
          });
          const createdTargets: Target[] = await transactionalEntityManager.save(Target, targetCreateDtos);

          const targetHolderCreateDtos: TargetHolderCreateDto[] = [];
          createdTargets.forEach(target => {
            if (target.holderPostId != null) {
              targetHolderCreateDtos.push({
                target: target,
                post: holderPostMapForCreation.get(target.holderPostId)
              })
            }
          })
          if (targetHolderCreateDtos.length > 0) {
            await transactionalEntityManager.insert(TargetHolder, targetHolderCreateDtos)
          }
        }
        if (updateProjectDto.targetUpdateDtos) {
          const targetIds = updateProjectDto.targetUpdateDtos.map(target => target._id)
          const targets = await transactionalEntityManager.findBy(Target, {
            id: In(targetIds)
          });
          const foundIds = targets.map(target => target.id);
          const missingIds = targetIds.filter(id => !foundIds.includes(id));
          if (missingIds.length > 0) {
            throw new NotFoundException(
              `Не найдены задачи с IDs: ${missingIds.join(', ')}`,
            );
          }
          const holderPostForUpdationIds = updateProjectDto.targetUpdateDtos
            .map(dto => dto.holderPostId)
            .filter((holderPostId) => holderPostId != null);
          const holderPostsForUpdation = await transactionalEntityManager.findBy(Post, {
            id: In(holderPostForUpdationIds),
          });
          const holderPostMapForUpdation = new Map(holderPostsForUpdation.map(post => [post.id, post]));
          const targetUpdateDtos = updateProjectDto.targetUpdateDtos.map(targetUpdateDto => {
            targetUpdateDto.holderPost = targetUpdateDto.holderPostId ? holderPostMapForUpdation.get(targetUpdateDto.holderPostId) : null;
            if (targetUpdateDto.targetState === State.FINISHED) targetUpdateDto.dateComplete = new Date();
            return targetUpdateDto;
          });
          const updatedTargetsResult = await transactionalEntityManager.upsert(
            Target,
            targetUpdateDtos.map(dto => ({
              ...dto,
              id: dto._id,  // Явно задаем соответствие `_id` → `id`
            })),
            {
              conflictPaths: ["id"],
              skipUpdateIfNoValuesChanged: true,
              upsertType: "on-conflict-do-update"
            }
          );
          const targetHolderCreateDtos: TargetHolderCreateDto[] = [];
          targetUpdateDtos.forEach(targetUpdateDto => {
            if (targetUpdateDto.holderPostId != null) {
              targetHolderCreateDtos.push({
                target: targets.find(target => target.id === targetUpdateDto._id),
                post: holderPostMapForUpdation.get(targetUpdateDto.holderPostId)
              })
            }
          })
          if (targetHolderCreateDtos.length > 0) {
            await transactionalEntityManager.insert(TargetHolder, targetHolderCreateDtos)
          }
        }

        return project.id;
      })
      return updatedProjectId;
    } catch (err) {
      this.logger.error(err);
      if (err instanceof NotFoundException) {
        throw err;
      }

      throw new InternalServerErrorException('Ошибка при обновлении проекта');
    }
  }
}
