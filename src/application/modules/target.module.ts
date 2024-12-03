import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Target } from 'src/domains/target.entity';
import { TargetService } from '../services/target/target.service';
import { TargetRepository } from '../services/target/repository/target.repository';
import { TargetController } from 'src/controllers/target.controller';
import { TargetHolderModule } from './targetHolder.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Target]),
    TargetHolderModule,
  ],
  controllers: [TargetController],
  providers: [TargetService, TargetRepository],
  exports: [TargetService],
})
export class TargetModule {}
