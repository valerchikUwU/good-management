import { Injectable, Inject } from '@nestjs/common';
import { User } from '../../../domains/user.entity'
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from 'src/contracts/create-user.dto';
import { ReadUserDto } from 'src/contracts/read-user.dto';
import { UsersRepository } from './Repository/users.repository';

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(User)
        private usersRepository: UsersRepository,
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
            refreshSessions: user.refreshSessions
            // Добавьте любые другие поля, которые должны быть включены в ответ
        }));
    }


    async findOne(id: string): Promise<ReadUserDto | null> {
        const user = await this.usersRepository.findOneBy({ id });
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
            refreshSessions: user.refreshSessions
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
            refreshSessions: user.refreshSessions
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


    async getByTelegramId(telegramId: number): Promise<ReadUserDto | null> {
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
            refreshSessions: user.refreshSessions
        };

        return readUserDto;
    }

    async getByVkId(vk_id: number): Promise<ReadUserDto | null> {
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
            refreshSessions: user.refreshSessions
        };

        return readUserDto;
    }

}
