import { BadRequestException, Inject, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Statistic } from "src/domains/statistic.entity";
import { AccountReadDto } from "src/contracts/account/read-account.dto";
import { StatisticReadDto } from "src/contracts/statistic/read-statistic.dto";

import { Logger } from "winston";
import { StatisticCreateDto } from "src/contracts/statistic/create-statistic.dto";
import { StatisticDataRepository } from "./repository/statisticData.repository";
import { StatisticData } from "src/domains/statisticData.entity";
import { StatisticDataReadDto } from "src/contracts/statisticData/read-statisticData.dto";
import { StatisticDataCreateDto } from "src/contracts/statisticData/create-statisticData.dto";
import { StatisticDataUpdateDto } from "src/contracts/statisticData/update-statisticData.dto";


@Injectable()
export class StatisticDataService {
    constructor(
        @InjectRepository(StatisticData)
        private readonly statisticDataRepository: StatisticDataRepository,
        @Inject('winston') private readonly logger: Logger
    ) { }

    async findAllForStatistic(statistic: StatisticReadDto): Promise<StatisticDataReadDto[]> {
        try {

            const statisticDatas = await this.statisticDataRepository.find({ where: { statistic: { id: statistic.id } } });

            return statisticDatas.map(statisticData => ({
                id: statisticData.id,
                createdAt: statisticData.createdAt,
                updatedAt: statisticData.updatedAt,
                value: statisticData.value,
                valueDate: statisticData.valueDate,
                isCorrelation: statisticData.isCorrelation,
                statistic: statisticData.statistic

            }))
        }
        catch (err) {

            this.logger.error(err);
            // Обработка других ошибок
            throw new InternalServerErrorException('Ошибка при получении всех данных по статистике!');

        }
    }

    async create(statisticDataCreateDto: StatisticDataCreateDto): Promise<string> {

        try {

            // Проверка на наличие обязательных данных
            if (!statisticDataCreateDto.value) {
                throw new BadRequestException('Введите данные!');
            }
            const statisticData = new StatisticData();
            statisticData.value = statisticDataCreateDto.value;
            statisticData.valueDate = statisticDataCreateDto.valueDate;
            statisticData.isCorrelation = statisticDataCreateDto.isCorrelation;
            statisticData.statistic = statisticDataCreateDto.statistic;
            const createdStatisticDataId = await this.statisticDataRepository.insert(statisticData);

            return createdStatisticDataId.identifiers[0].id;
        }
        catch (err) {
            this.logger.error(err);
            // Обработка специфичных исключений
            if (err instanceof BadRequestException) {
                throw err; // Пробрасываем исключение дальше
            }
            throw new InternalServerErrorException('Ошибка при создании данных!')
        }
    }


    async update(statisticDataUpdateDto: StatisticDataUpdateDto): Promise<string> {
        try {
            const statisticData = await this.statisticDataRepository.findOne({ where: { id: statisticDataUpdateDto._id } })
            if (!statisticData) {
                throw new NotFoundException(`Данные с ID ${statisticDataUpdateDto._id} не найдены`);
            }
            // Обновить свойства, если они указаны в DTO
            if (statisticDataUpdateDto.value) statisticData.value = statisticDataUpdateDto.value;
            if (statisticDataUpdateDto.valueDate) statisticData.valueDate = statisticDataUpdateDto.valueDate;
            if (statisticDataUpdateDto.isCorrelation !== undefined) statisticData.isCorrelation = statisticDataUpdateDto.isCorrelation;
            await this.statisticDataRepository.update(statisticData.id, {value: statisticData.value, valueDate: statisticData.valueDate, isCorrelation: statisticData.isCorrelation}) 
            return statisticData.id

        }
        catch (err) {

            this.logger.error(err);
            // Обработка специфичных исключений
            if (err instanceof NotFoundException) {
                throw err; // Пробрасываем исключение дальше
            }

            // Обработка других ошибок
            throw new InternalServerErrorException('Ошибка при обновлении данных статистики');
        }
    }

}