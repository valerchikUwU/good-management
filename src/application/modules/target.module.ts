import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Target } from 'src/domains/target.entity';
import { TargetService } from '../services/target/target.service';
import { TargetRepository } from '../services/target/repository/target.repository';
import { TargetHolderModule } from './targetHolder.module';
import { TargetController } from 'src/controllers/target.controller';
import { PostModule } from './post.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Target]),
    TargetHolderModule,
    PostModule
  ],
  controllers: [TargetController],
  providers: [TargetService, TargetRepository],
  exports: [TargetService],
})
export class TargetModule {}
