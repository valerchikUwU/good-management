import { IsDate, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';
import { ReadRefreshSessionDto } from '../refreshSession/read-refreshSession.dto';
import { Post } from 'src/domains/post.entity';
import { Goal } from 'src/domains/goal.entity';
import { Policy } from 'src/domains/policy.entity';
import { Strategy } from 'src/domains/strategy.entity';
import { Organization } from 'src/domains/organization.entity';
import { Account } from 'src/domains/account.entity';
import { Project } from 'src/domains/project.entity';
import { HistoryUsersToPost } from 'src/domains/historyUsersToPost.entity';
import { Type } from 'class-transformer';

export class ReadUserDto {
  @IsUUID()
  id: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsOptional()
  @IsString()
  middleName: string;

  @IsOptional()
  @IsNumber()
  telegramId: number;

  @IsString()
  telephoneNumber: string;

  @IsOptional()
  @IsString()
  avatar_url: string;

  @IsOptional()
  @IsNumber()
  vk_id: number;

  @IsDate()
  @Type(() => Date)
  createdAt: Date;

  @IsDate()
  @Type(() => Date)
  updatedAt: Date;
  posts: Post[];
  refreshSessions: ReadRefreshSessionDto[];
  goals: Goal[];
  policies: Policy[];
  strategies: Strategy[];
  projects: Project[];
  organization: Organization;
  account: Account;
  historiesUsersToPost: HistoryUsersToPost[]
}
