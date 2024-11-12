import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Statistic } from 'src/domains/statistic.entity';
import { StatisticRepository } from './repository/statistic.repository';
import { AccountReadDto } from 'src/contracts/account/read-account.dto';
import { StatisticReadDto } from 'src/contracts/statistic/read-statistic.dto';

import { Logger } from 'winston';
import { StatisticCreateDto } from 'src/contracts/statistic/create-statistic.dto';
import { StatisticUpdateDto } from 'src/contracts/statistic/update-statistic.dto';

@Injectable()
export class StatisticService {
  constructor(
    @InjectRepository(Statistic)
    private readonly statisticRepository: StatisticRepository,
    @Inject('winston') private readonly logger: Logger,
  ) {}

  async findAllForAccount(
    account: AccountReadDto,
  ): Promise<StatisticReadDto[]> {
    try {
      const statistics = await this.statisticRepository.find({
        where: { account: { id: account.id } },
        relations: ['statisticDatas', 'post.organization'],
      });

      return statistics.map((statistic) => ({
        id: statistic.id,
        type: statistic.type,
        name: statistic.name,
        description: statistic.description,
        createdAt: statistic.createdAt,
        updatedAt: statistic.updatedAt,
        statisticDatas: statistic.statisticDatas,
        post: statistic.post,
        account: statistic.account,
      }));
    } catch (err) {
      this.logger.error(err);
      // Обработка других ошибок
      throw new InternalServerErrorException(
        'Ошибка при получении всех статистик!',
      );
    }
  }

  async findOneById(
    id: string,
    relations?: string[],
  ): Promise<StatisticReadDto> {
    try {
      const statistic = await this.statisticRepository.findOne({
        where: { id: id },
        relations: relations !== undefined ? relations : [],
      });

      if (!statistic)
        throw new NotFoundException(`Статистика с ID: ${id} не найдена`);
      const statisticReadDto: StatisticReadDto = {
        id: statistic.id,
        type: statistic.type,
        name: statistic.name,
        description: statistic.description,
        createdAt: statistic.createdAt,
        updatedAt: statistic.updatedAt,
        statisticDatas: statistic.statisticDatas,
        post: statistic.post,
        account: statistic.account,
      };

      return statisticReadDto;
    } catch (err) {
      this.logger.error(err);
      // Обработка специфичных исключений
      if (err instanceof NotFoundException) {
        throw err; // Пробрасываем исключение дальше
      }

      // Обработка других ошибок
      throw new InternalServerErrorException('Ошибка при получении статистики');
    }
  }

  async create(statisticCreateDto: StatisticCreateDto): Promise<Statistic> {
    try {
      // Проверка на наличие обязательных данных
      if (!statisticCreateDto.name) {
        throw new BadRequestException(
          'У статистики обязательно наличие названия!',
        );
      }

      const statistic = new Statistic();
      statistic.type = statisticCreateDto.type;
      statistic.name = statisticCreateDto.name;
      statistic.description = statisticCreateDto.description;
      statistic.account = statisticCreateDto.account;
      statistic.post = statisticCreateDto.post;
      const createdStatistic = await this.statisticRepository.save(statistic);
      return createdStatistic;
    } catch (err) {
      this.logger.error(err);
      // Обработка специфичных исключений
      if (err instanceof BadRequestException) {
        throw err; // Пробрасываем исключение дальше
      }
      throw new InternalServerErrorException('Ошибка при создании статистики!');
    }
  }

  async update(
    _id: string,
    statisticUpdateDto: StatisticUpdateDto,
  ): Promise<string> {
    try {
      const statistic = await this.statisticRepository.findOne({
        where: { id: _id },
      });
      if (!statistic) {
        throw new NotFoundException(`Статистика с ID ${_id} не найдена`);
      }
      // Обновить свойства, если они указаны в DTO
      if (statisticUpdateDto.type) statistic.type = statisticUpdateDto.type;
      if (statisticUpdateDto.name) statistic.name = statisticUpdateDto.name;
      if (statisticUpdateDto.description)
        statistic.description = statisticUpdateDto.description;
      if (statisticUpdateDto.post) statistic.post = statisticUpdateDto.post;
      await this.statisticRepository.update(statistic.id, {
        type: statistic.type,
        name: statistic.name,
        description: statistic.description,
        post: statistic.post,
      });
      return statistic.id;
    } catch (err) {
      this.logger.error(err);
      // Обработка специфичных исключений
      if (err instanceof NotFoundException) {
        throw err; // Пробрасываем исключение дальше
      }

      // Обработка других ошибок
      throw new InternalServerErrorException(
        'Ошибка при обновлении статистики',
      );
    }
  }
}
