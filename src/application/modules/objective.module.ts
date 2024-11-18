import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Objective } from 'src/domains/objective.entity';
import { ObjectiveService } from '../services/objective/objective.service';
import { ObjectiveRepository } from '../services/objective/repository/objective.repository';
import { ObjectiveController } from 'src/controllers/objective.controller';
import { UsersModule } from './users.module';
import { StrategyModule } from './strategy.module';
import { OrganizationModule } from './organization.module';
import { QueueModule } from './queue.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Objective]),
    UsersModule,
    forwardRef(() => StrategyModule),
    forwardRef(() => QueueModule),
  ],
  controllers: [ObjectiveController],
  providers: [ObjectiveService, ObjectiveRepository],
  exports: [ObjectiveService]
})
export class ObjectiveModule {}
