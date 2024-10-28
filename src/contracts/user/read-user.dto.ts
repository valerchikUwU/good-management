import { IsUUID } from 'class-validator';
import { ReadRefreshSessionDto } from '../refreshSession/read-refreshSession.dto';
import { Post } from 'src/domains/post.entity';
import { Goal } from 'src/domains/goal.entity';
import { Policy } from 'src/domains/policy.entity';
import { Strategy } from 'src/domains/strategy.entity';
import { TargetHolder } from 'src/domains/targetHolder.entity';
import { Organization } from 'src/domains/organization.entity';
import { Account } from 'src/domains/account.entity';
import { Project } from 'src/domains/project.entity';
import { Role } from 'src/domains/role.entity';
import { Convert } from 'src/domains/convert.entity';
import { ConvertToUser } from 'src/domains/convertToUser.entity';
import { Message } from 'src/domains/message.entity';
import { GroupToUser } from 'src/domains/groupToUser.entity';

export class ReadUserDto {
    @IsUUID()
    id: string;
    firstName: string;
    lastName: string;
    middleName: string;
    telegramId: number;
    telephoneNumber: string;
    avatar_url: string;
    vk_id: number;
    createdAt: Date;
    updatedAt: Date;
    posts: Post[];
    refreshSessions: ReadRefreshSessionDto[];
    goals: Goal[];
    policies: Policy[];
    strategies: Strategy[];
    targetHolders: TargetHolder[];
    projects: Project[];
    organization: Organization;
    account: Account;
    role: Role;
    convert: Convert;
    convertToUsers: ConvertToUser[];
    messages: Message[];
    groupToUsers: GroupToUser[];;
  }