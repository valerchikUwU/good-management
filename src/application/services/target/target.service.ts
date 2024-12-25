import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { State, Target, Type } from 'src/domains/target.entity';
import { TargetRepository } from './repository/target.repository';
import { TargetReadDto } from 'src/contracts/target/read-target.dto';
import { TargetCreateDto } from 'src/contracts/target/create-target.dto';
import { TargetHolderService } from '../targetHolder/targetHolder.service';
import { TargetHolderCreateDto } from 'src/contracts/targetHolder/create-targetHolder.dto';
import { TargetUpdateDto } from 'src/contracts/target/update-target.dto';
import { Logger } from 'winston';

@Injectable()
export class TargetService {
  constructor(
    @InjectRepository(Target)
    private readonly targetRepository: TargetRepository,
    private readonly targetHolderService: TargetHolderService,
    @Inject('winston') private readonly logger: Logger,
  ) {}

  async findAllPersonal(userId: string): Promise<TargetReadDto[]> {
    try {
      const targets = await this.targetRepository
      .createQueryBuilder('target')
      .leftJoin('target.project', 'project')
      .leftJoin('target.targetHolders', 'targetHolders')
      .leftJoin('targetHolders.post', 'post')
      .leftJoin('post.user', 'user')
      .where('project.id IS NULL')
      .andWhere('post.user.id = :userId', {userId: userId})
      .getMany()

      return targets.map((target) => ({
        id: target.id,
        type: target.type,
        orderNumber: target.orderNumber,
        content: target.content,
        holderPostId: target.holderPostId,
        targetState: target.targetState,
        dateStart: target.dateStart,
        deadline: target.deadline,
        dateComplete: target.dateComplete,
        createdAt: target.createdAt,
        updatedAt: target.updatedAt,
        targetHolders: target.targetHolders,
        project: target.project,
      }));
    } catch (err) {
      this.logger.error(err);
      // Обработка других ошибок
      throw new InternalServerErrorException(
        'Ошибка при получении всех задач!',
      );
    }
  }


  async findAllFromProjects(userId: string): Promise<TargetReadDto[]> {
    try {
      const targets = await this.targetRepository
      .createQueryBuilder('target')
      .leftJoin('target.project', 'project')
      .leftJoin('target.targetHolders', 'targetHolders')
      .leftJoin('targetHolders.post', 'post')
      .leftJoin('post.user', 'user')
      .where('project.id IS NOT NULL')
      .andWhere('post.user.id = :userId', {userId: userId})
      .getMany()

      return targets.map((target) => ({
        id: target.id,
        type: target.type,
        orderNumber: target.orderNumber,
        content: target.content,
        holderPostId: target.holderPostId,
        targetState: target.targetState,
        dateStart: target.dateStart,
        deadline: target.deadline,
        dateComplete: target.dateComplete,
        createdAt: target.createdAt,
        updatedAt: target.updatedAt,
        targetHolders: target.targetHolders,
        project: target.project,
      }));
    } catch (err) {
      this.logger.error(err);
      // Обработка других ошибок
      throw new InternalServerErrorException(
        'Ошибка при получении всех задач!',
      );
    }
  }



  async create(targetCreateDto: TargetCreateDto): Promise<Target> {
    try {
      // Проверка на наличие обязательных данных

      const target = new Target();
      target.type = targetCreateDto.type;
      target.orderNumber = targetCreateDto.orderNumber;
      target.content = targetCreateDto.content;
      target.holderPostId = targetCreateDto.holderPostId;
      target.dateStart = new Date();
      target.deadline = targetCreateDto.deadline;
      target.project = targetCreateDto.project;
      const createdTargetResult = await this.targetRepository.insert(target);
      const createdTarget = await this.targetRepository.findOne({
        where: { id: createdTargetResult.identifiers[0].id },
      });
      const targetHolderCreateDto: TargetHolderCreateDto = {
        target: createdTarget,
        post: targetCreateDto.holderPost,
      };
      await this.targetHolderService.create(targetHolderCreateDto);
      return createdTarget;
    } catch (err) {
      this.logger.error(err);
      // Обработка специфичных исключений
      if (err instanceof BadRequestException) {
        throw err; // Пробрасываем исключение дальше
      }

      // Обработка других ошибок
      throw new InternalServerErrorException('Ошибка при создании задачи');
    }
  }

  async update(updateTargetDto: TargetUpdateDto): Promise<string> {
    try {
      const target = await this.targetRepository.findOne({
        where: { id: updateTargetDto._id },
      });
      if (!target) {
        throw new NotFoundException(
          `Задача с ID ${updateTargetDto._id} не найдена`,
        );
      }
      // Обновить свойства, если они указаны в DTO
      if (updateTargetDto.content) target.content = updateTargetDto.content;
      if (updateTargetDto.orderNumber) target.orderNumber = updateTargetDto.orderNumber;
      if (updateTargetDto.holderPost) {
        const targetHolderCreateDto: TargetHolderCreateDto = {
          target: target,
          post: updateTargetDto.holderPost,
        };
        await this.targetHolderService.create(targetHolderCreateDto);
        target.holderPostId = updateTargetDto.holderPostId;
      }
      if (updateTargetDto.targetState) target.targetState = updateTargetDto.targetState;
      if (updateTargetDto.targetState === State.FINISHED) target.dateComplete = new Date();
      if (updateTargetDto.dateStart) target.dateStart = updateTargetDto.dateStart;
      if (updateTargetDto.deadline) target.deadline = updateTargetDto.deadline;
      await this.targetRepository.update(target.id, {
        content: target.content,
        orderNumber: target.orderNumber,
        holderPostId: target.holderPostId,
        targetState: target.targetState,
        dateStart: target.dateStart,
        deadline: target.deadline,
        dateComplete: target.dateComplete,
      });
      return target.id;
    } catch (err) {
      this.logger.error(err);
      // Обработка специфичных исключений
      if (err instanceof NotFoundException) {
        throw err; // Пробрасываем исключение дальше
      }

      // Обработка других ошибок
      throw new InternalServerErrorException('Ошибка при обновлении задачи');
    }
  }
}
