import { IsUUID } from 'class-validator';
import { ReadRefreshSessionDto } from '../refreshSession/read-refreshSession.dto';
import { Post } from 'src/domains/post.entity';
import { Goal } from 'src/domains/goal.entity';
import { Policy } from 'src/domains/policy.entity';
import { Strategy } from 'src/domains/strategy.entity';
import { TargetHolder } from 'src/domains/targetHolder.entity';
import { Organization } from 'src/domains/organization.entity';
import { Account } from 'src/domains/account.entity';

export class ReadUserDto {
    @IsUUID()
    id: string;
    firstName: string;
    lastName: string;
    telegramId: number;
    telephoneNumber: string;
    avatar_url: string;
    vk_id: number;
    createdAt: Date;
    updatedAt: Date;
    post: Post;
    refreshSessions: ReadRefreshSessionDto[];
    goals: Goal[];
    policies: Policy[];
    strategies: Strategy[];
    targetHolders: TargetHolder[];
    organization: Organization;
    account: Account;
  
    // Вы можете добавить дополнительные поля в соответствии с вашими требованиями
  }