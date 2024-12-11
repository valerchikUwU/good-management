import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ObjectiveRepository } from './repository/objective.repository';
import { ObjectiveReadDto } from 'src/contracts/objective/read-objective.dto';
import { Objective } from 'src/domains/objective.entity';
import { ObjectiveCreateDto } from 'src/contracts/objective/create-objective.dto';
import { AccountReadDto } from 'src/contracts/account/read-account.dto';
import { ObjectiveUpdateDto } from 'src/contracts/objective/update-objective.dto';
import { Logger } from 'winston';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ObjectiveService {
  constructor(
    @InjectRepository(Objective)
    private readonly objectiveRepository: ObjectiveRepository,
    @Inject('winston') private readonly logger: Logger,
  ) {}

  async findAllForAccount(account: AccountReadDto, relations?: string[]): Promise<ObjectiveReadDto[]> {
    try {
      const objectives = await this.objectiveRepository.find({
        where: { account: { id: account.id } }, relations: relations !== undefined ? relations : []
      });

      return objectives.map((objective) => ({
        id: objective.id,
        situation: objective.situation,
        content: objective.content,
        rootCause: objective.rootCause,
        createdAt: objective.createdAt,
        updatedAt: objective.updatedAt,
        strategy: objective.strategy,
        account: objective.account,
      }));
    } catch (err) {
      this.logger.error(err);
      // Обработка других ошибок
      throw new InternalServerErrorException(
        'Ошибка при получении всех краткосрочных целей!',
      );
    }
  }

  async findOneById(id: string): Promise<ObjectiveReadDto | null> {
    try {
      const objective = await this.objectiveRepository.findOne({
        where: { id: id },
        relations: ['strategy'],
      });

      if (!objective)
        throw new NotFoundException(
          `Краткосрочная цель с ID: ${id} не найдена`,
        );
      const objectiveReadDto: ObjectiveReadDto = {
        id: objective.id,
        situation: objective.situation,
        content: objective.content,
        rootCause: objective.rootCause,
        createdAt: objective.createdAt,
        updatedAt: objective.updatedAt,
        strategy: objective.strategy,
        account: objective.account,
      };

      return objectiveReadDto;
    } catch (err) {
      this.logger.error(err);
      // Обработка специфичных исключений
      if (err instanceof NotFoundException) {
        throw err; // Пробрасываем исключение дальше
      }

      // Обработка других ошибок
      throw new InternalServerErrorException(
        'Ошибка при получении краткосрочной цели',
      );
    }
  }

  async findOneByStrategyId(strategyId: string, relations?: string[]): Promise<ObjectiveReadDto | null> {
    try {
      const objective = await this.objectiveRepository.findOne({
        where: { strategy: { id: strategyId } },
        relations: relations !== undefined ? relations : [],
      });

      if (!objective)
        throw new NotFoundException(
          `Краткосрочная цель с ID: ${strategyId} не найдена`,
        );
      const objectiveReadDto: ObjectiveReadDto = {
        id: objective.id,
        situation: objective.situation,
        content: objective.content,
        rootCause: objective.rootCause,
        createdAt: objective.createdAt,
        updatedAt: objective.updatedAt,
        strategy: objective.strategy,
        account: objective.account,
      };

      return objectiveReadDto;
    } catch (err) {
      this.logger.error(err);
      // Обработка специфичных исключений
      if (err instanceof NotFoundException) {
        throw err; // Пробрасываем исключение дальше
      }

      // Обработка других ошибок
      throw new InternalServerErrorException(
        'Ошибка при получении краткосрочной цели по id стратегии',
      );
    }
  }

  async create(objectiveCreateDto: ObjectiveCreateDto): Promise<string> {
    try {
      // Проверка на наличие обязательных данных
      if (!objectiveCreateDto.strategyId) {
        throw new BadRequestException(
          'Выберите стратегию для краткосрочной цели!',
        );
      }

      const objective = new Objective();
      objective.situation = objectiveCreateDto.situation;
      objective.content = objectiveCreateDto.content;
      objective.rootCause = objectiveCreateDto.rootCause;
      objective.strategy = objectiveCreateDto.strategy;
      objective.account = objectiveCreateDto.account;
      const createdObjectiveId = await this.objectiveRepository.insert(objective);
      return createdObjectiveId.identifiers[0].id;
    } catch (err) {
      this.logger.error(err);
      // Обработка специфичных исключений
      if (err instanceof BadRequestException) {
        throw err; // Пробрасываем исключение дальше
      }
      throw new InternalServerErrorException(
        'Ошибка при создании краткосрочной цели',
      );
    }
  }

  async update(
    _id: string,
    updateObjectiveDto: ObjectiveUpdateDto,
  ): Promise<string> {
    try {
      const objective = await this.objectiveRepository.findOne({
        where: { id: _id },
      });
      if (!objective) {
        throw new NotFoundException(
          `Краткосрочная цель с ID ${_id} не найдена`,
        );
      }
      // Обновить свойства, если они указаны в DTO
      if (updateObjectiveDto.situation)
        objective.situation = updateObjectiveDto.situation;
      if (updateObjectiveDto.content)
        objective.content = updateObjectiveDto.content;
      if (updateObjectiveDto.rootCause)
        objective.rootCause = updateObjectiveDto.rootCause;
      if (updateObjectiveDto.strategy)
        objective.strategy = updateObjectiveDto.strategy;
      await this.objectiveRepository.update(objective.id, {
        situation: objective.situation,
        content: objective.content,
        rootCause: objective.rootCause,
        strategy: objective.strategy,
      });
      return objective.id;
    } catch (err) {
      this.logger.error(err);
      // Обработка специфичных исключений
      if (err instanceof NotFoundException) {
        throw err; // Пробрасываем исключение дальше
      }

      // Обработка других ошибок
      throw new InternalServerErrorException(
        'Ошибка при обновлении краткосрочной цели',
      );
    }
  }
}
