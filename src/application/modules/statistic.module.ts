import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users.module';
import { Statistic } from 'src/domains/statistic.entity';
import { StatisticRepository } from '../services/statistic/repository/statistic.repository';
import { StatisticService } from '../services/statistic/statistic.service';
import { StatisticController } from 'src/controllers/statistic.controller';
import { StatisticDataModule } from './statisticData.module';
import { PostModule } from './post.module';
import { QueueModule } from './queue.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Statistic]),
    StatisticDataModule,
    forwardRef(() => PostModule),
    forwardRef(() => QueueModule),
  ],
  controllers: [StatisticController],
  providers: [StatisticService, StatisticRepository],
  exports: [StatisticService],
})
export class StatisticModule {}
