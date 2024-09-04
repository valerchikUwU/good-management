import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { RefreshSession } from "src/domains/refreshSession.entity";
import { RefreshSessionRepository } from "./Repository/refresh.repository";
import { ReadRefreshSessionDto } from "src/contracts/read-refreshSession.dto";
import { CreateRefreshSessionDto } from "src/contracts/create-refreshSession.dto";
import { UpdateRefreshSessionDto } from "src/contracts/update-refreshSession.dto";



@Injectable()
export class RefreshService {
    constructor(
        private sessionsRepository: RefreshSessionRepository,
    ) { }


    async findAllByUserId(userId: string): Promise<ReadRefreshSessionDto[]>{
        const sessions = await this.sessionsRepository.findAllByUserId(userId);
        return sessions.map(session => ({
            id: session.id,
            user_agent: session.user_agent,
            fingerprint: session.fingerprint,
            ip: session.ip,
            expiresIn: session.expiresIn,
            refreshToken: session.refreshToken,
            user: session.user
            // Добавьте любые другие поля, которые должны быть включены в ответ
        }))
    }


    async create(createSessionDto: CreateRefreshSessionDto): Promise<RefreshSession> {
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

    async findOneByFingerprint(fingerprint: string): Promise<ReadRefreshSessionDto | null> {
        const session = await this.sessionsRepository.findOneByFingerprint(fingerprint);
        // Преобразование объекта User в ReadUserDto
        const readRefreshSessionDto: ReadRefreshSessionDto = {
            
            id: session.id,
            user_agent: session.user_agent,
            fingerprint: session.fingerprint,
            ip: session.ip,
            expiresIn: session.expiresIn,
            refreshToken: session.refreshToken,
            user: session.user
        };

        return readRefreshSessionDto;
    }

    async findOneByIdAndFingerprint(id: string, fingerprint: string): Promise<ReadRefreshSessionDto | null> {
        
      console.error( fingerprint)
      
      console.error( id)
        const session = await this.sessionsRepository.findOneByIdAndFingerprint(id, fingerprint);
        console.log(`SERVICE ${JSON.stringify(session)}`)
        if (!session) return null;

        // Преобразование объекта User в ReadUserDto
        const readRefreshSessionDto: ReadRefreshSessionDto = {
            
            id: session.id,
            user_agent: session.user_agent,
            fingerprint: session.fingerprint,
            ip: session.ip,
            expiresIn: session.expiresIn,
            refreshToken: session.refreshToken,
            user: session.user
        };

        return readRefreshSessionDto;
    }

    async remove(id: string): Promise<void> {
        await this.sessionsRepository.delete(id);
    }

    async updateRefreshTokenById(id: string, refreshToken: string): Promise<void> {
        const session = await this.sessionsRepository.findOneBy({id});
        if(!session) return null
        await this.sessionsRepository.update(id, {
            refreshToken: refreshToken
        })
    }

    async getId(refreshToken: string): Promise<string> {
        const session = await this.sessionsRepository.findOneBy({refreshToken});
        if(!session) return null
        return session.id;
    }
}