import {
  Injectable,
  Inject,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { User } from '../../../domains/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from 'src/contracts/user/create-user.dto';
import { ReadUserDto } from 'src/contracts/user/read-user.dto';
import { UsersRepository } from './Repository/users.repository';
import { UpdateUserDto } from 'src/contracts/user/update-user.dto';
import { AccountReadDto } from 'src/contracts/account/read-account.dto';
import { Logger } from 'winston';
import { UpdateTgAuthUserDto } from 'src/contracts/user/update-tgauthUser.dto';
import { UpdateVkAuthUserDto } from 'src/contracts/user/update-vkauthUser.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: UsersRepository,
    @Inject('winston') private readonly logger: Logger,
  ) {}

  async findAll(): Promise<ReadUserDto[]> {
    const users = await this.usersRepository.find();
    return users.map((user) => ({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      middleName: user.middleName,
      telegramId: user.telegramId,
      telephoneNumber: user.telephoneNumber,
      avatar_url: user.avatar_url,
      vk_id: user.vk_id,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      posts: user.posts,
      refreshSessions: user.refreshSessions,
      goals: user.goals,
      policies: user.policies,
      strategies: user.strategies,
      targetHolders: user.targetHolders,
      projects: user.projects,
      organization: user.organization,
      account: user.account,
      role: user.role,
      convert: user.convert,
      convertToUsers: user.convertToUsers,
      messages: user.messages,
      groupToUsers: user.groupToUsers,
      historiesUsersToPost: user.historiesUsersToPost

      // Добавьте любые другие поля, которые должны быть включены в ответ
    }));
  }

  async findAllForAccount(
    account: AccountReadDto,
    relations?: string[],
  ): Promise<ReadUserDto[]> {
    try {
      const users = await this.usersRepository.find({
        where: { account: { id: account.id } },
        relations: relations !== undefined ? relations : [],
      });
      return users.map((user) => ({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        middleName: user.middleName,
        telegramId: user.telegramId,
        telephoneNumber: user.telephoneNumber,
        avatar_url: user.avatar_url,
        vk_id: user.vk_id,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        posts: user.posts,
        refreshSessions: user.refreshSessions,
        goals: user.goals,
        policies: user.policies,
        strategies: user.strategies,
        targetHolders: user.targetHolders,
        projects: user.projects,
        organization: user.organization,
        account: user.account,
        role: user.role,
        convert: user.convert,
        convertToUsers: user.convertToUsers,
        messages: user.messages,
        groupToUsers: user.groupToUsers,
        historiesUsersToPost: user.historiesUsersToPost

        // Добавьте любые другие поля, которые должны быть включены в ответ
      }));
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(
        'Ошибка при получении всех пользователей!',
      );
    }
  }

  async findAllForOrganization(
    organizationId: string,
    relations?: string[],
  ): Promise<ReadUserDto[]> {
    try {
      const users = await this.usersRepository.find({
        where: { organization: { id: organizationId } },
        relations: relations !== undefined ? relations : [],
      });
      return users.map((user) => ({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        middleName: user.middleName,
        telegramId: user.telegramId,
        telephoneNumber: user.telephoneNumber,
        avatar_url: user.avatar_url,
        vk_id: user.vk_id,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        posts: user.posts,
        refreshSessions: user.refreshSessions,
        goals: user.goals,
        policies: user.policies,
        strategies: user.strategies,
        targetHolders: user.targetHolders,
        projects: user.projects,
        organization: user.organization,
        account: user.account,
        role: user.role,
        convert: user.convert,
        convertToUsers: user.convertToUsers,
        messages: user.messages,
        groupToUsers: user.groupToUsers,
        historiesUsersToPost: user.historiesUsersToPost

        // Добавьте любые другие поля, которые должны быть включены в ответ
      }));
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(
        'Ошибка при получении всех пользователей!',
      );
    }
  }

  async findOne(id: string, relations?: string[]): Promise<ReadUserDto> {
    try {
      const user = await this.usersRepository.findOne({
        where: { id },
        relations: relations !== undefined ? relations : [],
      });
      if (!user) throw new NotFoundException(`Пользователь с ${id} не найден!`);
      // Преобразование объекта User в ReadUserDto
      const readUserDto: ReadUserDto = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        middleName: user.middleName,
        telegramId: user.telegramId,
        telephoneNumber: user.telephoneNumber,
        avatar_url: user.avatar_url,
        vk_id: user.vk_id,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        posts: user.posts,
        refreshSessions: user.refreshSessions,
        goals: user.goals,
        policies: user.policies,
        strategies: user.strategies,
        targetHolders: user.targetHolders,
        projects: user.projects,
        organization: user.organization,
        account: user.account,
        role: user.role,
        convert: user.convert,
        convertToUsers: user.convertToUsers,
        messages: user.messages,
        groupToUsers: user.groupToUsers,
        historiesUsersToPost: user.historiesUsersToPost
      };

      return readUserDto;
    } catch (err) {
      // Обработка специфичных исключений
      if (err instanceof NotFoundException) {
        this.logger.error(err);
        throw err; // Пробрасываем исключение дальше
      }

      this.logger.error(err);
      // Обработка других ошибок
      throw new InternalServerErrorException(
        'Ошибка при получении пользователя',
      );
    }
  }

  async findOneByTelephoneNumber(
    telephoneNumber: string,
  ): Promise<ReadUserDto | null> {
    try {
      const user = await this.usersRepository.findOneBy({ telephoneNumber });
      if (!user)
        throw new NotFoundException(
          `Пользователь с номером телефона ${telephoneNumber} не найден!`,
        );

      // Преобразование объекта User в ReadUserDto
      const readUserDto: ReadUserDto = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        middleName: user.middleName,
        telegramId: user.telegramId,
        telephoneNumber: user.telephoneNumber,
        avatar_url: user.avatar_url,
        vk_id: user.vk_id,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        posts: user.posts,
        refreshSessions: user.refreshSessions,
        goals: user.goals,
        policies: user.policies,
        strategies: user.strategies,
        targetHolders: user.targetHolders,
        projects: user.projects,
        organization: user.organization,
        account: user.account,
        role: user.role,
        convert: user.convert,
        convertToUsers: user.convertToUsers,
        messages: user.messages,
        groupToUsers: user.groupToUsers,
        historiesUsersToPost: user.historiesUsersToPost
      };

      return readUserDto;
    } catch (err) {
      // Обработка специфичных исключений
      if (err instanceof NotFoundException) {
        this.logger.error(err);
        throw err; // Пробрасываем исключение дальше
      }

      this.logger.error(err);
      // Обработка других ошибок
      throw new InternalServerErrorException(
        'Ошибка при получении пользователя',
      );
    }
  }

  async findOneByTelegramId(telegramId: number): Promise<ReadUserDto | null> {
    try {
      const user = await this.usersRepository.findOneBy({ telegramId });
      if (!user)
        return null;

      // Преобразование объекта User в ReadUserDto
      const readUserDto: ReadUserDto = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        middleName: user.middleName,
        telegramId: user.telegramId,
        telephoneNumber: user.telephoneNumber,
        avatar_url: user.avatar_url,
        vk_id: user.vk_id,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        posts: user.posts,
        refreshSessions: user.refreshSessions,
        goals: user.goals,
        policies: user.policies,
        strategies: user.strategies,
        targetHolders: user.targetHolders,
        projects: user.projects,
        organization: user.organization,
        account: user.account,
        role: user.role,
        convert: user.convert,
        convertToUsers: user.convertToUsers,
        messages: user.messages,
        groupToUsers: user.groupToUsers,
        historiesUsersToPost: user.historiesUsersToPost
      };

      return readUserDto;
    } catch (err) {
      this.logger.error(err);
      if (err instanceof NotFoundException) {
        throw err;
      }

      throw new InternalServerErrorException(
        'Ошибка при получении пользователя',
      );
    }
  }

  async findByVkId(vk_id: number): Promise<ReadUserDto | null> {
    try {
      const user = await this.usersRepository.findOneBy({ vk_id });
      if (!user)
        throw new NotFoundException(
          `Пользователь с vk ID: ${vk_id} не найден!`,
        );

      // Преобразование объекта User в ReadUserDto
      const readUserDto: ReadUserDto = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        middleName: user.middleName,
        telegramId: user.telegramId,
        telephoneNumber: user.telephoneNumber,
        avatar_url: user.avatar_url,
        vk_id: user.vk_id,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        posts: user.posts,
        refreshSessions: user.refreshSessions,
        goals: user.goals,
        policies: user.policies,
        strategies: user.strategies,
        targetHolders: user.targetHolders,
        projects: user.projects,
        organization: user.organization,
        account: user.account,
        role: user.role,
        convert: user.convert,
        convertToUsers: user.convertToUsers,
        messages: user.messages,
        groupToUsers: user.groupToUsers,
        historiesUsersToPost: user.historiesUsersToPost
      };

      return readUserDto;
    } catch (err) {
      this.logger.error(err);

      // Обработка специфичных исключений
      if (err instanceof NotFoundException) {
        throw err; // Пробрасываем исключение дальше
      }

      // Обработка других ошибок
      throw new InternalServerErrorException(
        'Ошибка при получении пользователя',
      );
    }
  }

  async remove(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }

  async create(createUserDto: CreateUserDto): Promise<string> {
    try {
      // Проверка на наличие обязательных данных
      if (!createUserDto.firstName) {
        throw new BadRequestException('У юзера обязательно наличие имени!');
      }
      if (!createUserDto.lastName) {
        throw new BadRequestException('У юзера обязательно наличие фамилии!');
      }
      if (!createUserDto.telephoneNumber) {
        throw new BadRequestException(
          'У юзера обязательно наличие номера телефона!',
        );
      }
      if (!createUserDto.role) {
        throw new BadRequestException('У юзера обязательно наличие роли!');
      }
      const user = new User();
      if (user.id) user.id = createUserDto.id;
      user.firstName = createUserDto.firstName;
      user.lastName = createUserDto.lastName;
      user.middleName = createUserDto.middleName;
      user.telephoneNumber = createUserDto.telephoneNumber;
      user.role = createUserDto.role;
      user.account = createUserDto.account;
      const createdUserId = await this.usersRepository.insert(user);
      return createdUserId.identifiers[0].id;
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException('Ошибка при создании задачи');
    }
  }

  async update(
    _id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<ReadUserDto | null> {
    try {
      const user = await this.usersRepository.findOneBy({ id: _id });

      if (!user)
        throw new NotFoundException(`Не найден юзер с таким ID: ${_id}`);

      if (updateUserDto.firstName) user.firstName = updateUserDto.firstName;
      if (updateUserDto.lastName) user.lastName = updateUserDto.lastName;
      if (updateUserDto.middleName) user.middleName = updateUserDto.middleName;
      if (updateUserDto.telephoneNumber)
        user.telephoneNumber = updateUserDto.telephoneNumber;
      await this.usersRepository.update(_id, {
        firstName: updateUserDto.firstName,
      });

      return await this.usersRepository.save(user);
    } catch (err) {
      this.logger.error(err);
      // Обработка специфичных исключений
      if (err instanceof NotFoundException) {
        throw err; // Пробрасываем исключение дальше
      }

      // Обработка других ошибок
      throw new InternalServerErrorException('Ошибка при обновлении юзера');
    }
  }

  async updateTgAuth(
    user: User,
    updateTgAuthUserDto: UpdateTgAuthUserDto,
  ): Promise<string> {
    try {
      const updatedUserResult = await this.usersRepository.update(user.id, {telegramId: updateTgAuthUserDto.telegramId})
      return user.id;
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException('Ошибка при обновлении юзера');
    }
  }

  async updateVkAuth(
    user: User,
    updateVkAuthUserDto: UpdateVkAuthUserDto,
  ): Promise<ReadUserDto | null> {
    try {
      user.vk_id = updateVkAuthUserDto.vk_id;
      user.avatar_url = updateVkAuthUserDto.avatar_url;
      return this.usersRepository.save(user);
    } catch (err) {
      this.logger.error(err);
      // Обработка специфичных исключений

      // Обработка других ошибок
      throw new InternalServerErrorException('Ошибка при обновлении юзера');
    }
  }
}
