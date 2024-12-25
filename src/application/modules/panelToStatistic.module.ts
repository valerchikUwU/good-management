import { Module } from '@nestjs/common';
import { PanelToStatisticService } from '../services/panelToStatistic/panelToStatistic.service';
import { PanelToStatisticRepository } from '../services/panelToStatistic/repository/panelToStatistic.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PanelToStatistic } from 'src/domains/panelToStatistic.entity';
import { StatisticModule } from './statistic.module';


@Module({
  imports: [
    TypeOrmModule.forFeature([PanelToStatistic]),
    StatisticModule
  ],
  providers: [PanelToStatisticService, PanelToStatisticRepository],
  exports: [PanelToStatisticService],
})
export class PanelToStatisticModule { }
