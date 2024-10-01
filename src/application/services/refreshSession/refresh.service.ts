import { BadRequestException, Inject, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { RefreshSession } from "src/domains/refreshSession.entity";
import { RefreshSessionRepository } from "./Repository/refresh.repository";
import { ReadRefreshSessionDto } from "src/contracts/refreshSession/read-refreshSession.dto";
import { CreateRefreshSessionDto } from "src/contracts/refreshSession/create-refreshSession.dto";
import { UpdateRefreshSessionDto } from "src/contracts/refreshSession/update-refreshSession.dto";
import { Logger } from "winston";



@Injectable()
export class RefreshService {
    constructor(
        private sessionsRepository: RefreshSessionRepository,
        @Inject('winston') private readonly logger: Logger,
    ) { }


    async findAllByUserId(userId: string): Promise<ReadRefreshSessionDto[]> {
        try {

            const sessions = await this.sessionsRepository.findAllByUserId(userId);
            return sessions.map(session => ({
                id: session.id,
                user_agent: session.user_agent,
                fingerprint: session.fingerprint,
                ip: session.ip,
                expiresIn: session.expiresIn,
                refreshToken: session.refreshToken,
                createdAt: session.createdAt,
                updatedAt: session.updatedAt,
                user: session.user
                // Добавьте любые другие поля, которые должны быть включены в ответ
            }))
        }
        catch (err) {

            this.logger.error(err);
            // Обработка других ошибок
            throw new InternalServerErrorException('Ошибка при получении всех сессий!');
        }
    }


    async create(createSessionDto: CreateRefreshSessionDto): Promise<RefreshSession> {
        try {


            // Проверка на наличие обязательных данных

            if (!createSessionDto.user_agent) {
                throw new BadRequestException('User_Agent не может быть пустым!');
            }
            if (!createSessionDto.fingerprint) {
                throw new BadRequestException('Fingerprint не может быть пустым!');
            }
            if (!createSessionDto.ip) {
                throw new BadRequestException('IP не может быть пустым!');
            }
            if (!createSessionDto.expiresIn) {
                throw new BadRequestException('expiresIn не может быть пустым!');
            }
            if (!createSessionDto.refreshToken) {
                throw new BadRequestException('refreshToken не может быть пустым!');
            }
            const session = new RefreshSession();
            session.user_agent = createSessionDto.user_agent;
            session.fingerprint = createSessionDto.fingerprint;
            session.ip = createSessionDto.ip;
            session.expiresIn = createSessionDto.expiresIn;
            session.refreshToken = createSessionDto.refreshToken;
            session.user = createSessionDto.user;
            // Присваиваем значения из DTO объекту пользователя
            return await this.sessionsRepository.save(session);
        }
        catch (err) {

            this.logger.error(err);
            // Обработка специфичных исключений
            if (err instanceof BadRequestException) {
                throw err; // Пробрасываем исключение дальше
            }
            throw new InternalServerErrorException('Ошибка при создании сессии!')
        }
    }

    async findOneByFingerprint(fingerprint: string): Promise<ReadRefreshSessionDto | null> {
        try {
            const session = await this.sessionsRepository.findOneByFingerprint(fingerprint);
            if (!session) throw new NotFoundException(`Сессия с fingerprint: ${fingerprint} не найдена`);
            // Преобразование объекта User в ReadUserDto
            const readRefreshSessionDto: ReadRefreshSessionDto = {

                id: session.id,
                user_agent: session.user_agent,
                fingerprint: session.fingerprint,
                ip: session.ip,
                expiresIn: session.expiresIn,
                refreshToken: session.refreshToken,
                createdAt: session.createdAt,
                updatedAt: session.updatedAt,
                user: session.user
            };

            return readRefreshSessionDto;
        }
        catch (err) {

            this.logger.error(err);
            // Обработка специфичных исключений
            if (err instanceof NotFoundException) {
                throw err; // Пробрасываем исключение дальше
            }

            // Обработка других ошибок
            throw new InternalServerErrorException('Ошибка при получении сессии');
        }
    }

    async findOneByIdAndFingerprint(id: string, fingerprint: string): Promise<ReadRefreshSessionDto | null> {
        try {
            const session = await this.sessionsRepository.findOneByIdAndFingerprint(id, fingerprint);
            if (!session) throw new NotFoundException(`Сессия с fingerprint: ${fingerprint} и ID: ${id} не найдена`);

            // Преобразование объекта User в ReadUserDto
            const readRefreshSessionDto: ReadRefreshSessionDto = {

                id: session.id,
                user_agent: session.user_agent,
                fingerprint: session.fingerprint,
                ip: session.ip,
                expiresIn: session.expiresIn,
                refreshToken: session.refreshToken,
                createdAt: session.createdAt,
                updatedAt: session.updatedAt,
                user: session.user
            };

            return readRefreshSessionDto;
        }
        catch (err) {

            this.logger.error(err);
            // Обработка специфичных исключений
            if (err instanceof NotFoundException) {
                throw err; // Пробрасываем исключение дальше
            }

            // Обработка других ошибок
            throw new InternalServerErrorException('Ошибка при получении сессии');
        }
    }

    async remove(id: string): Promise<void> {
        await this.sessionsRepository.delete(id);
    }

    async updateRefreshTokenById(id: string, refreshToken: string): Promise<void> {
        try {

            const session = await this.sessionsRepository.findOneBy({ id });
            if (!session) throw new NotFoundException(`Сессия с ID: ${id} не найдена`);
            await this.sessionsRepository.update(id, {
                refreshToken: refreshToken
            })
        }
        catch (err) {

            this.logger.error(err);
            // Обработка специфичных исключений
            if (err instanceof NotFoundException) {
                throw err; // Пробрасываем исключение дальше
            }

            // Обработка других ошибок
            throw new InternalServerErrorException('Ошибка при обновлении сессии');
        }
    }

    async getId(refreshToken: string): Promise<string> {
        try {

            const session = await this.sessionsRepository.findOneBy({ refreshToken });
            if (!session) throw new NotFoundException(`Сессия с refreshToken: ${refreshToken} не найдена`);
            return session.id;
        }
        catch (err) {

            this.logger.error(err);
            // Обработка специфичных исключений
            if (err instanceof NotFoundException) {
                throw err; // Пробрасываем исключение дальше
            }

            // Обработка других ошибок
            throw new InternalServerErrorException('Ошибка при получении id сессии');
        }
    }
}