import {
    BadRequestException,
    Inject,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
  } from '@nestjs/common';
  import { InjectRepository } from '@nestjs/typeorm';
  import { Logger } from 'winston';
import { HistoryUsersToPostRepository } from './repository/historyUsersToPost.repository';
import { AccountReadDto } from 'src/contracts/account/read-account.dto';
import { HistoryUsersToPostReadDto } from 'src/contracts/historyUsersToPost/read-historyUsersToPost.dto';
import { PostReadDto } from 'src/contracts/post/read-post.dto';
import { HistoryUsersToPost } from 'src/domains/historyUsersToPost.entity';
import { HistoryUsersToPostCreateDto } from 'src/contracts/historyUsersToPost/create-historyUsersToPost.dto';

  @Injectable()
  export class HistoryUsersToPostService {
    constructor(
      @InjectRepository(HistoryUsersToPost)
      private readonly historyUsersToPostRepository: HistoryUsersToPostRepository,
      @Inject('winston') private readonly logger: Logger,
    ) {}
  
    async findAllForPost(post: PostReadDto): Promise<HistoryUsersToPostReadDto[]> {
      try {
        const historiesUsersToPost = await this.historyUsersToPostRepository.find({
          where: { post: { id: post.id } },
        });
  
        return historiesUsersToPost.map((historiyUsersToPost) => ({
            id: historiyUsersToPost.id,
            createdAt: historiyUsersToPost.createdAt,
            updatedAt: historiyUsersToPost.updatedAt,
            user: historiyUsersToPost.user,
            post: historiyUsersToPost.post
        }));
      } catch (err) {
        this.logger.error(err);
        // Обработка других ошибок
        throw new InternalServerErrorException(
          'Ошибка при получении всех историй!',
        );
      }
    }
  
    // async findAllByDivisionName(divisionName: string): Promise<GroupReadDto[]> {
    //   try {
    //     const groups = await this.groupRepository.find({
    //       where: { groupDivisionName: divisionName },
    //       relations: ['groupToUsers.user'],
    //     });
  
    //     return groups.map((group) => ({
    //       id: group.id,
    //       groupName: group.groupName,
    //       groupNumber: group.groupNumber,
    //       createdAt: group.createdAt,
    //       updatedAt: group.updatedAt,
    //       groupToUsers: group.groupToUsers,
    //       account: group.account,
    //     }));
    //   } catch (err) {
    //     this.logger.error(err);
    //     // Обработка других ошибок
    //     throw new InternalServerErrorException(
    //       'Ошибка при получении всех групп!',
    //     );
    //   }
    // }
  
    // async findOneById(id: string, relations?: string[]): Promise<GroupReadDto> {
    //   try {
    //     const group = await this.groupRepository.findOne({
    //       where: { id },
    //       relations: relations !== undefined ? relations : [],
    //     });
    //     if (!group) throw new NotFoundException(`Группа с ID: ${id} не найдена`);
    //     const groupReadDto: GroupReadDto = {
    //       id: group.id,
    //       groupName: group.groupName,
    //       groupNumber: group.groupNumber,
    //       createdAt: group.createdAt,
    //       updatedAt: group.updatedAt,
    //       groupToUsers: group.groupToUsers,
    //       account: group.account,
    //     };
  
    //     return groupReadDto;
    //   } catch (err) {
    //     this.logger.error(err);
    //     // Обработка специфичных исключений
    //     if (err instanceof NotFoundException) {
    //       throw err; // Пробрасываем исключение дальше
    //     }
  
    //     // Обработка других ошибок
    //     throw new InternalServerErrorException('Ошибка при получении группы');
    //   }
    // }
  
    async create(historyUsersToPostCreateDto: HistoryUsersToPostCreateDto): Promise<string> {
      try {
  
        const historyUsersToPost = new HistoryUsersToPostCreateDto();
        historyUsersToPost.user = historyUsersToPostCreateDto.user;
        historyUsersToPost.post = historyUsersToPostCreateDto.post;
        const createdHistoryUsersToPost = await this.historyUsersToPostRepository.insert(historyUsersToPost);

        return createdHistoryUsersToPost.identifiers[0].id;
      } catch (err) {
        this.logger.error(err);
        // Обработка специфичных исключений

        throw new InternalServerErrorException('Ошибка при создании истории');
      }
    }
  
    // async update(_id: string, updateGroupDto: GroupUpdateDto): Promise<string> {
    //   try {
    //     const group = await this.groupRepository.findOne({ where: { id: _id } });
    //     if (!group) {
    //       throw new NotFoundException(`Группа с ID ${_id} не найдена`);
    //     }
    //     // Обновить свойства, если они указаны в DTO
    //     if (updateGroupDto.groupName) group.groupName = updateGroupDto.groupName;
  
    //     if (updateGroupDto.groupToUsers) {
    //       await this.groupToUserService.remove(group);
    //       await this.groupToUserService.createSeveral(
    //         group,
    //         updateGroupDto.groupToUsers,
    //       );
    //     }
    //     await this.groupRepository.update(group.id, {
    //       groupName: group.groupName,
    //     });
    //     return group.id;
    //   } catch (err) {
    //     this.logger.error(err);
    //     // Обработка специфичных исключений
    //     if (err instanceof NotFoundException) {
    //       throw err; // Пробрасываем исключение дальше
    //     }
  
    //     // Обработка других ошибок
    //     throw new InternalServerErrorException('Ошибка при обновлении группы');
    //   }
    // }
  }
  