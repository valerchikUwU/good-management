import { Injectable, Inject, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { User } from '../../../domains/user.entity'
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from 'src/contracts/user/create-user.dto';
import { ReadUserDto } from 'src/contracts/user/read-user.dto';
import { UsersRepository } from './Repository/users.repository';
import { UpdateUserDto } from 'src/contracts/user/update-user.dto';
import { AccountReadDto } from 'src/contracts/account/read-account.dto';
import { Logger } from 'winston';

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(User)
        private usersRepository: UsersRepository,
        @Inject('winston') private readonly logger: Logger,
    ) { }


    async findAll(): Promise<ReadUserDto[]> {
        const users = await this.usersRepository.find();
        return users.map(user => ({
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
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
            account: user.account

            // Добавьте любые другие поля, которые должны быть включены в ответ
        }));
    }

    async findAllForAccount(account: AccountReadDto): Promise<ReadUserDto[]> {
        const users = await this.usersRepository.find({ where: { account: { id: account.id } } });
        return users.map(user => ({
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
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
            account: user.account

            // Добавьте любые другие поля, которые должны быть включены в ответ
        }));
    }


    async findOne(id: string): Promise<ReadUserDto | null> {
        try {
            const user = await this.usersRepository.findOne({ where: { id }, relations: ['account', 'organization'] });
            if (!user) throw new NotFoundException(`Пользователь с ${id} не найден!`);
            // Преобразование объекта User в ReadUserDto
            const readUserDto: ReadUserDto = {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
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
                account: user.account
            };

            return readUserDto;
        }
        catch (err) {

            // Обработка специфичных исключений
            if (err instanceof NotFoundException) {

                this.logger.error(err);
                throw err; // Пробрасываем исключение дальше
            }

            this.logger.error(err);
            // Обработка других ошибок
            throw new InternalServerErrorException('Ошибка при получении пользователя');
        }

    }

    async findOneByTelephoneNumber(telephoneNumber: string): Promise<ReadUserDto | null> {
        const user = await this.usersRepository.findOneBy({ telephoneNumber });
        if (!user) return null;

        // Преобразование объекта User в ReadUserDto
        const readUserDto: ReadUserDto = {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
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
            account: user.account
        };

        return readUserDto;
    }

    async findOneByTelegramId(telegramId: number): Promise<ReadUserDto | null> {
        const user = await this.usersRepository.findOneBy({ telegramId });
        if (!user) return null;

        // Преобразование объекта User в ReadUserDto
        const readUserDto: ReadUserDto = {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
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
            account: user.account
        };

        return readUserDto;
    }

    async remove(id: string): Promise<void> {
        await this.usersRepository.delete(id);
    }


    async create(createUserDto: CreateUserDto): Promise<User> {
        const user = new User();
        user.firstName = createUserDto.firstName;
        user.lastName = createUserDto.lastName;
        user.telephoneNumber = createUserDto.telephoneNumber;
        user.avatar_url = createUserDto.avatar_url;
        user.vk_id = createUserDto.vk_id
        user.telegramId = createUserDto.telegramId;
        // Присваиваем значения из DTO объекту пользователя
        return await this.usersRepository.save(user);
    }



    async findByVkId(vk_id: number): Promise<ReadUserDto | null> {
        const user = await this.usersRepository.findOneBy({ vk_id });
        if (!user) return null;

        // Преобразование объекта User в ReadUserDto
        const readUserDto: ReadUserDto = {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
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
            account: user.account
        };

        return readUserDto;
    }


    async updateByPhoneNumber(telephoneNumber: string, telegramId: number): Promise<ReadUserDto | null> {
        const user = await this.usersRepository.findOneBy({ telephoneNumber });
        if (!user) return null;
        const updateUserDto: UpdateUserDto = {
            telegramId: telegramId
        }
        user.telegramId = updateUserDto.telegramId;

        return user;
    }

}
