import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Logger } from 'winston';
import { GroupToUser } from 'src/domains/groupToUser.entity';
import { UsersService } from '../users/users.service';
import { GroupToUserRepository } from './repository/groupToUser.repository';
import { Group } from 'src/domains/group.entity';
import { GroupReadDto } from 'src/contracts/group/read-group.dto';

@Injectable()
export class GroupToUserService {
  constructor(
    @InjectRepository(GroupToUser)
    private readonly groupToUserRepository: GroupToUserRepository,
    private readonly userService: UsersService,
    @Inject('winston') private readonly logger: Logger,
  ) {}

  async createSeveral(group: Group, userIds: string[]): Promise<GroupToUser[]> {
    const createdRelations: GroupToUser[] = [];

    for (const userId of userIds) {
      try {
        const user = await this.userService.findOne(userId);
        if (!user) {
          throw new NotFoundException(`User not found with id ${userId}`);
        }

        const groupToUser = new GroupToUser();
        groupToUser.user = user;
        groupToUser.group = group;

        const savedRelation =
          await this.groupToUserRepository.save(groupToUser);
        createdRelations.push(savedRelation);
      } catch (err) {
        this.logger.error(err);
        if (err instanceof NotFoundException) {
          throw err;
        }

        throw new InternalServerErrorException(
          'Ой, что - то пошло не так при добавлении юзера к группе!',
        );
        // Здесь можно добавить логику для обработки ошибок, например, откат транзакции
      }
    }

    return createdRelations;
  }

  async remove(group: GroupReadDto): Promise<void> {
    await this.groupToUserRepository.delete({ group: group });
  }
}
