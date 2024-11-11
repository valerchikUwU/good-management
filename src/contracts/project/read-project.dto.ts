import { Account } from 'src/domains/account.entity';
import { Organization } from 'src/domains/organization.entity';
import { Type } from 'src/domains/project.entity';
import { Strategy } from 'src/domains/strategy.entity';
import { Target } from 'src/domains/target.entity';
import { User } from 'src/domains/user.entity';

export class ProjectReadDto {
  id: string;
  projectNumber: number;
  projectName: string;
  programId: string;
  content: string;
  programNumber?: number | null;
  type: Type;
  createdAt: Date;
  updatedAt: Date;
  organization: Organization;
  targets: Target[];
  strategy: Strategy;
  account: Account;
  user: User;
}
