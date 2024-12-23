import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organization } from 'src/domains/organization.entity';
import { OrganizationService } from '../services/organization/organization.service';
import { OrganizationRepository } from '../services/organization/repository/organization.repository';
import { OrganizationController } from 'src/controllers/organization.controller';
import { UsersModule } from './users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Organization])],
  controllers: [OrganizationController],
  providers: [OrganizationService, OrganizationRepository],
  exports: [OrganizationService],
})
export class OrganizationModule {}
