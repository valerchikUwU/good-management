// user.repository.ts
import { Repository, DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { RefreshSession } from '../../../../domains/refreshSession.entity';


@Injectable()
export class RefreshSessionRepository extends Repository<RefreshSession> {
    constructor(private dataSource: DataSource) {
        super(RefreshSession, dataSource.createEntityManager());
    }

    async findAllByUserId(userId: string): Promise<RefreshSession[] | null> {
        return await this.find({
            relations: ['user'],
            where: { user: { id: userId } },
        });
    }


    // ...
}