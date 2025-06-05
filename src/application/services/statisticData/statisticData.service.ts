import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Logger } from 'winston';
import { StatisticDataRepository } from './repository/statisticData.repository';
import { CorrelationType, StatisticData } from 'src/domains/statisticData.entity';
import { StatisticDataCreateDto } from 'src/contracts/statisticData/create-statisticData.dto';
import { StatisticDataUpdateDto } from 'src/contracts/statisticData/update-statisticData.dto';
import { StatisticDataReadDto } from 'src/contracts/statisticData/read-statisticData.dto';
import { ReportDay } from 'src/domains/organization.entity';

@Injectable()
export class StatisticDataService {
  constructor(
    @InjectRepository(StatisticData)
    private readonly statisticDataRepository: StatisticDataRepository,
    @Inject('winston') private readonly logger: Logger,
  ) { }


  async findDaily(statisticId: string, datePoint: string): Promise<StatisticDataReadDto[]> {
    try {
      const reportDayTyped = new Date(datePoint.split(' ')[0]);
      const reportDayPlus7Days = new Date(reportDayTyped.getTime() + 7 * 24 * 60 * 60 * 1000);
      const statisticDatas = await this.statisticDataRepository
        .createQueryBuilder('statistic_data')
        .where('statistic_data.statisticId = :statisticId', { statisticId })
        .andWhere('statistic_data.valueDate >= :reportDayTyped', { reportDayTyped })
        .andWhere('statistic_data.valueDate < :reportDayPlus7Days', { reportDayPlus7Days })
        .andWhere('statistic_data.correlationType IS NULL')
        .orderBy('statistic_data.valueDate', 'ASC')
        .getMany()

      return statisticDatas.map((data) => ({
        id: data.id,
        value: data.value,
        valueDate: data.valueDate,
        correlationType: data.correlationType,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
        statistic: data.statistic
      }));
    }
    catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException('Ошибка при получении точек!');
    }
  }

  async findMonthly(statisticId: string, datePoint: string): Promise<any[]> {
    try {
      const today = new Date(datePoint);
      const endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      const startDate = new Date(endDate);
      startDate.setFullYear(startDate.getFullYear() - 1, today.getMonth() - 1);

      const monthlyPoints = await this.statisticDataRepository
        .createQueryBuilder('statistic_data')
        .select([
          'EXTRACT(MONTH FROM statistic_data.valueDate) AS month',
          'EXTRACT(YEAR FROM statistic_data.valueDate) AS year',
          'statistic_data.value AS total'
        ])
        .where('statistic_data.statisticId = :statisticId', { statisticId })
        .andWhere('statistic_data.valueDate BETWEEN :startDate AND :endDate', { startDate, endDate })
        .andWhere('statistic_data.correlationType = :type', { type: CorrelationType.MONTH })
        .getRawMany();

      const regularPoints = await this.statisticDataRepository
        .createQueryBuilder('statistic_data')
        .where('statistic_data.statisticId = :statisticId', { statisticId })
        .andWhere('statistic_data.valueDate BETWEEN :startDate AND :endDate', { startDate, endDate })
        .andWhere('statistic_data.correlationType IS NULL')
        .select([
          'EXTRACT(MONTH FROM statistic_data.valueDate) AS month',
          'EXTRACT(YEAR FROM statistic_data.valueDate) AS year',
          'SUM(statistic_data.value) AS total'
        ])
        .groupBy('year, month')
        .getRawMany();

      const result = [];
      for (let i = 0; i < 13; i++) {
        const date = new Date(endDate);
        date.setMonth(date.getMonth() - i);

        const year = date.getFullYear();
        const month = date.getMonth() + 1;

        const monthlyPoint = monthlyPoints.find((p) => p.month == month && p.year == year);
        const regularPoint = regularPoints.find((p) => p.month == month && p.year == year);

        result.push({
          year,
          month,
          total: monthlyPoint ? parseFloat(monthlyPoint.total) : (regularPoint ? parseFloat(regularPoint.total) : 0),
        });
      }

      return result.reverse();
    }
    catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException('Ошибка при получении точек!');
    }
  }


  async findYearly(statisticId: string, datePoint: string): Promise<any[]> {
    try {
      const today = new Date(datePoint);
      const endDate = new Date(today.getFullYear() + 1, 0, 0);
      const startDate = new Date(endDate);
      startDate.setFullYear(startDate.getFullYear() - 11);
      const [yearlyPoints, monthlyPoints, regularPoints] = await Promise.all([
        await this.statisticDataRepository
          .createQueryBuilder('statistic_data')
          .select([
            'EXTRACT(YEAR FROM statistic_data.valueDate) AS year',
            'CAST(SUM(statistic_data.value) AS FLOAT) AS total'
          ])
          .where('statistic_data.statisticId = :statisticId', { statisticId })
          .andWhere('statistic_data.valueDate BETWEEN :startDate AND :endDate', { startDate, endDate })
          .andWhere('statistic_data.correlationType = :type', { type: CorrelationType.YEAR })
          .groupBy('year')
          .getRawMany(),

        await this.statisticDataRepository
          .createQueryBuilder('statistic_data')
          .select([
            'EXTRACT(YEAR FROM statistic_data.valueDate) AS year',
            'EXTRACT(MONTH FROM statistic_data.valueDate) AS month',
            'CAST(SUM(statistic_data.value) AS FLOAT) AS total'
          ])
          .where('statistic_data.statisticId = :statisticId', { statisticId })
          .andWhere('statistic_data.valueDate BETWEEN :startDate AND :endDate', { startDate, endDate })
          .andWhere('statistic_data.correlationType = :type', { type: CorrelationType.MONTH })
          .groupBy('year, month')
          .getRawMany(),

        await this.statisticDataRepository
          .createQueryBuilder('statistic_data')
          .select([
            'EXTRACT(YEAR FROM statistic_data.valueDate) AS year',
            'EXTRACT(MONTH FROM statistic_data.valueDate) AS month',
            'CAST(SUM(statistic_data.value) AS FLOAT) AS total'
          ])
          .where('statistic_data.statisticId = :statisticId', { statisticId })
          .andWhere('statistic_data.valueDate BETWEEN :startDate AND :endDate', { startDate, endDate })
          .andWhere('statistic_data.correlationType IS NULL')
          .groupBy('year, month')
          .getRawMany(),
      ])

      const monthlyKeys = new Set(
        monthlyPoints.map(mp => `${mp.year}-${mp.month}`)
      );
      const regularWithoutCorrelationMonths = regularPoints.filter(
        p => !monthlyKeys.has(`${p.year}-${p.month}`)
      );

      const allPointsForAllYears = regularWithoutCorrelationMonths.concat(monthlyPoints)

      const regularPointsSumPerYear = new Map<string, number>();
      allPointsForAllYears.forEach(p => {
        if (regularPointsSumPerYear.has(p.year)) {
          const sum = regularPointsSumPerYear.get(p.year);
          regularPointsSumPerYear.set(p.year, sum + p.total);
        } else {
          regularPointsSumPerYear.set(p.year, p.total);
        }
      });

      const resultRegularPoints = [];
      for (let [key, value] of regularPointsSumPerYear) {
        resultRegularPoints.push({ year: key, total: value })
      }


      const result = [];
      for (let i = 0; i < 12; i++) {
        const date = new Date(endDate);
        date.setFullYear(date.getFullYear() - i);
        const year = date.getFullYear();

        const yearlyPoint = yearlyPoints.find(p => p.year == year);
        const regularPoint = resultRegularPoints.find(p => p.year == year);

        result.push({
          year,
          total: yearlyPoint
            ? parseFloat(yearlyPoint.total)
            : (regularPoint ? parseFloat(regularPoint.total) : 0),
        });
      }

      return result.reverse();
    }
    catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException('Ошибка при получении точек!');
    }
  }

  async findSeveralWeeks(statisticId: string, datePoint: string, weeksCount: number): Promise<any[]> {
    try {
      //02.06.2025
      const reportDayTyped = new Date(datePoint.split(' ')[0]);
      const weeksAgo = new Date(reportDayTyped);
      switch (weeksCount) {
        case 13:
          weeksAgo.setDate(weeksAgo.getDate() - (13 * 7));
          break;
          case 26:
          weeksAgo.setDate(weeksAgo.getDate() - (26 * 7));
          break;
          case 52:
          weeksAgo.setDate(weeksAgo.getDate() - (52 * 7));
          break;
      }
      console.log(weeksAgo)
      const statisticDatas = await this.statisticDataRepository
        .createQueryBuilder('statistic_data')
        .where('statistic_data.statisticId = :statisticId', { statisticId })
        .andWhere('statistic_data.valueDate <= :reportDayTyped', { reportDayTyped })
        .andWhere('statistic_data.valueDate > :weeksAgo', { weeksAgo })
        .andWhere('statistic_data.correlationType IS NULL')
        .orderBy('statistic_data.valueDate', 'ASC')
        .getMany()


      return statisticDatas.map((data) => ({
        id: data.id,
        value: data.value,
        valueDate: data.valueDate,
        correlationType: data.correlationType,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
        statistic: data.statistic
      }));
    }
    catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException('Ошибка при получении точек!');
    }
  }

  async create(
    statisticDataCreateDto: StatisticDataCreateDto,
  ): Promise<string> {
    try {
      const statisticData = new StatisticData();
      statisticData.value = statisticDataCreateDto.value;
      statisticData.valueDate = statisticDataCreateDto.valueDate;
      statisticData.correlationType = statisticDataCreateDto.correlationType;
      statisticData.statistic = statisticDataCreateDto.statistic;
      const createdStatisticDataId =
        await this.statisticDataRepository.insert(statisticData);

      return createdStatisticDataId.identifiers[0].id;
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException('Ошибка при создании данных!');
    }
  }

  async update(
    statisticDataUpdateDto: StatisticDataUpdateDto,
  ): Promise<string> {
    try {
      const statisticData = await this.statisticDataRepository.findOne({
        where: { id: statisticDataUpdateDto._id },
      });
      if (!statisticData) {
        throw new NotFoundException(
          `Данные с ID ${statisticDataUpdateDto._id} не найдены`,
        );
      }
      if (statisticDataUpdateDto.value)
        statisticData.value = statisticDataUpdateDto.value;
      if (statisticDataUpdateDto.valueDate)
        statisticData.valueDate = statisticDataUpdateDto.valueDate;
      if (statisticDataUpdateDto.correlationType)
        statisticData.correlationType = statisticDataUpdateDto.correlationType;
      await this.statisticDataRepository.update(statisticData.id, {
        value: statisticData.value,
        valueDate: statisticData.valueDate,
        correlationType: statisticData.correlationType,
      });
      return statisticData.id;
    } catch (err) {
      this.logger.error(err);
      if (err instanceof NotFoundException) {
        throw err;
      }
      throw new InternalServerErrorException(
        'Ошибка при обновлении данных статистики',
      );
    }
  }
}
