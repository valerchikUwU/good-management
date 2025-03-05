import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AccountReadDto } from 'src/contracts/account/read-account.dto';
import { Logger } from 'winston';
import { Group } from 'src/domains/group.entity';
import { GroupReadDto } from 'src/contracts/group/read-group.dto';
import { GroupRepository } from './repository/group.repository';
import { GroupCreateDto } from 'src/contracts/group/create-group.dto';
import { GroupUpdateDto } from 'src/contracts/group/update-group.dto';
import { GroupToUserService } from '../groupToUser/groupToUser.service';

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(Group)
    private readonly groupRepository: GroupRepository,
    private readonly groupToUserService: GroupToUserService,
    @Inject('winston') private readonly logger: Logger,
  ) {}

  async findAllForAccount(account: AccountReadDto): Promise<GroupReadDto[]> {
    try {
      const groups = await this.groupRepository.find({
        where: { account: { id: account.id } },
      });

      return groups.map((group) => ({
        id: group.id,
        groupName: group.groupName,
        groupNumber: group.groupNumber,
        createdAt: group.createdAt,
        updatedAt: group.updatedAt,
        groupToUsers: group.groupToUsers,
        account: group.account,
      }));
    } catch (err) {
      this.logger.error(err);
      // Обработка других ошибок
      throw new InternalServerErrorException(
        'Ошибка при получении всех групп!',
      );
    }
  }

  async findAllByDivisionName(divisionName: string): Promise<GroupReadDto[]> {
    try {
      const groups = await this.groupRepository.find({
        where: { groupDivisionName: divisionName },
        relations: ['groupToUsers.user'],
      });

      return groups.map((group) => ({
        id: group.id,
        groupName: group.groupName,
        groupNumber: group.groupNumber,
        createdAt: group.createdAt,
        updatedAt: group.updatedAt,
        groupToUsers: group.groupToUsers,
        account: group.account,
      }));
    } catch (err) {
      this.logger.error(err);
      // Обработка других ошибок
      throw new InternalServerErrorException(
        'Ошибка при получении всех групп!',
      );
    }
  }

  async findOneById(id: string, relations?: string[]): Promise<GroupReadDto> {
    try {
      const group = await this.groupRepository.findOne({
        where: { id },
        relations: relations ?? [],
      });
      if (!group) throw new NotFoundException(`Группа с ID: ${id} не найдена`);
      const groupReadDto: GroupReadDto = {
        id: group.id,
        groupName: group.groupName,
        groupNumber: group.groupNumber,
        createdAt: group.createdAt,
        updatedAt: group.updatedAt,
        groupToUsers: group.groupToUsers,
        account: group.account,
      };

      return groupReadDto;
    } catch (err) {
      this.logger.error(err);
      // Обработка специфичных исключений
      if (err instanceof NotFoundException) {
        throw err; // Пробрасываем исключение дальше
      }

      // Обработка других ошибок
      throw new InternalServerErrorException('Ошибка при получении группы');
    }
  }

  async create(groupCreateDto: GroupCreateDto): Promise<string> {
    try {
      // Проверка на наличие обязательных данных
      if (!groupCreateDto.groupName) {
        throw new BadRequestException('У группы обязательно наличие названия!');
      }
      if (!groupCreateDto.groupToUsers) {
        throw new BadRequestException('Выберите хотя бы одного юзера!');
      }

      const group = new Group();
      group.groupName = groupCreateDto.groupName;
      group.account = groupCreateDto.account;
      const createdGroup = await this.groupRepository.save(group);
      await this.groupToUserService.createSeveral(
        createdGroup,
        groupCreateDto.groupToUsers,
      );

      return createdGroup.id;
    } catch (err) {
      this.logger.error(err);
      // Обработка специфичных исключений
      if (err instanceof BadRequestException) {
        throw err; // Пробрасываем исключение дальше
      }
      throw new InternalServerErrorException('Ошибка при создании группы');
    }
  }

  async update(_id: string, updateGroupDto: GroupUpdateDto): Promise<string> {
    try {
      const group = await this.groupRepository.findOne({ where: { id: _id } });
      if (!group) {
        throw new NotFoundException(`Группа с ID ${_id} не найдена`);
      }
      // Обновить свойства, если они указаны в DTO
      if (updateGroupDto.groupName) group.groupName = updateGroupDto.groupName;

      if (updateGroupDto.groupToUsers) {
        await this.groupToUserService.remove(group);
        await this.groupToUserService.createSeveral(
          group,
          updateGroupDto.groupToUsers,
        );
      }
      await this.groupRepository.update(group.id, {
        groupName: group.groupName,
      });
      return group.id;
    } catch (err) {
      this.logger.error(err);
      // Обработка специфичных исключений
      if (err instanceof NotFoundException) {
        throw err; // Пробрасываем исключение дальше
      }

      // Обработка других ошибок
      throw new InternalServerErrorException('Ошибка при обновлении группы');
    }
  }
}
