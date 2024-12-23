import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { OrganizationService } from '../organization/organization.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Policy } from 'src/domains/policy.entity';
import { PolicyReadDto } from 'src/contracts/policy/read-policy.dto';
import { Logger } from 'winston';
import { PolicyToPolicyDirectory } from 'src/domains/policyToPolicyDirectories.entity';
import { PolicyToPolicyDirectoryRepository } from './repository/policyToPolicyDirectory.repository';
import { PolicyDirectory } from 'src/domains/policyDirectory.entity';
import { PolicyService } from '../policy/policy.service';
import { PolicyDirectoryReadDto } from 'src/contracts/policyDirectory/read-policyDirectory.dto';

@Injectable()
export class PolicyToPolicyDirectoryService {
  constructor(
    @InjectRepository(PolicyToPolicyDirectory)
    private readonly policyToPolicyDirectoryRepository: PolicyToPolicyDirectoryRepository,
    private readonly policyService: PolicyService,
    @Inject('winston') private readonly logger: Logger,
  ) {}

  async createSeveral(
    policyDirectory: PolicyDirectory,
    policyIds: string[],
  ): Promise<void> {

    for (const policyId of policyIds) {
      try {
        const policy = await this.policyService.findOneById(policyId);

        const policyToPolicyDirectory = new PolicyToPolicyDirectory();
        policyToPolicyDirectory.policy = policy;
        policyToPolicyDirectory.policyDirectory = policyDirectory;

        await this.policyToPolicyDirectoryRepository.insert(policyToPolicyDirectory);
      } catch (err) {
        this.logger.error(err);
        if (err instanceof NotFoundException) {
          throw err;
        }

        throw new InternalServerErrorException(
          'Ой, что - то пошло не так при добавлении политик в папку!',
        );
        // Здесь можно добавить логику для обработки ошибок, например, откат транзакции
      }
    }

    return createdRelations;
  }

  async remove(policyDirectory: PolicyDirectoryReadDto): Promise<void> {
    await this.policyToPolicyDirectoryRepository.delete({
      policyDirectory: policyDirectory,
    });
  }
}
