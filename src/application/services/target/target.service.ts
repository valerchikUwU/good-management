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
import { And, Between, Equal, In, IsNull, LessThan, Not, Or } from 'typeorm';

@Injectable()
export class TargetService {
  constructor(
    @InjectRepository(Target)
    private readonly targetRepository: TargetRepository,
    private readonly targetHolderService: TargetHolderService,
    @Inject('winston') private readonly logger: Logger,
  ) { }

  async findAllPersonalForUserPosts(postIds: string[], isArchive: boolean, relations?: string[]): Promise<TargetReadDto[]> {
    try {
      const today = new Date();
      const todayUTC = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
      const yesterdayUTC = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate() - 1));
      const tomorrowUTC = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate() + 1));
      const targets = await this.targetRepository.find({
        where: {
          holderPostId: In(postIds),
          project: { id: IsNull() },
          dateComplete: isArchive ? LessThan(todayUTC) : Or(IsNull(), Between(yesterdayUTC, tomorrowUTC)),
          type: Type.PERSONAL
        },
        relations: relations !== undefined ? relations : []
      })

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
        policy: target.policy,
      }));
    } catch (err) {
      this.logger.error(err);
      // Обработка других ошибок
      throw new InternalServerErrorException(
        'Ошибка при получении всех задач!',
      );
    }
  }


  async findAllOrdersForUserPosts(postIds: string[], isArchive: boolean): Promise<TargetReadDto[]> {
    try {
      const today = new Date();
      const todayUTC = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
      const yesterdayUTC = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate() - 1));
      const tomorrowUTC = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate() + 1));
      const targets = await this.targetRepository.find({
        where: {
          holderPostId: In(postIds),
          project: { id: IsNull() },
          dateComplete: isArchive ? LessThan(todayUTC) : Or(IsNull(), Between(yesterdayUTC, tomorrowUTC)),
          type: Type.ORDER
        }
      })

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
        policy: target.policy,
      }));
    } catch (err) {
      this.logger.error(err);
      // Обработка других ошибок
      throw new InternalServerErrorException(
        'Ошибка при получении всех задач!',
      );
    }
  }

  async findAllFromProjectsForUserPosts(postIds: string[], isArchive: boolean): Promise<TargetReadDto[]> {
    try {
      const today = new Date();
      const todayUTC = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
      const yesterdayUTC = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate() - 1));
      const tomorrowUTC = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate() + 1));
      const targets = await this.targetRepository.find({
        where: {
          holderPostId: In(postIds),
          project: { id: Not(IsNull()) },
          dateComplete: isArchive ? LessThan(todayUTC) : Or(IsNull(), Between(yesterdayUTC, tomorrowUTC)),
        }
      })

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
        policy: target.policy,
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
      target.dateStart = targetCreateDto.dateStart !== undefined ? targetCreateDto.dateStart : new Date();
      target.deadline = targetCreateDto.deadline;
      target.project = targetCreateDto.project;
      target.policy = targetCreateDto.policy;
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
      if (updateTargetDto.policy != null) {
        target.policy = updateTargetDto.policy;
      }
      else if (updateTargetDto.policyId === null){
        target.policy = null 
      }
      await this.targetRepository.update(target.id, {
        content: target.content,
        orderNumber: target.orderNumber,
        holderPostId: target.holderPostId,
        targetState: target.targetState,
        dateStart: target.dateStart,
        deadline: target.deadline,
        dateComplete: target.dateComplete,
        policy: target.policy
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


  async remove(_id: string): Promise<void> {
    try {
      const target = await this.targetRepository.findOne({
        where: { id: _id },
      });
      if (!target) {
        throw new NotFoundException(`Личная задача с ID ${_id} не найдена`);
      }
      if (target.type !== Type.PERSONAL)
        throw new BadRequestException('Удалять можно только личные задачи!')

      await this.targetHolderService.remove(target);
      await this.targetRepository.remove(target);
    }
    catch (err) {

      this.logger.error(err);
      // Обработка специфичных исключений
      if (err instanceof NotFoundException) {
        throw err; // Пробрасываем исключение дальше
      }
      // Обработка специфичных исключений
      if (err instanceof BadRequestException) {
        throw err; // Пробрасываем исключение дальше
      }
      throw new InternalServerErrorException('Ошибка при удалении панели управления')
    }

  }
}
