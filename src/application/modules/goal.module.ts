import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Goal } from 'src/domains/goal.entity';
import { GoalService } from '../services/goal/goal.service';
import { GoalRepository } from '../services/goal/repository/goal.repository';
import { GoalController } from 'src/controllers/goal.controller';
import { UsersModule } from './users.module';
import { GeneratorModule } from './generator.module';
import { OrganizationModule } from './organization.module';
import { QueueModule } from './queue.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Goal]),
    UsersModule,
    GeneratorModule,
    OrganizationModule,
    forwardRef(() => QueueModule),
  ],
  controllers: [GoalController],
  providers: [GoalService, GoalRepository],
})
export class GoalModule {}
