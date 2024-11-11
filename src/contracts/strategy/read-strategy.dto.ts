import { Account } from 'src/domains/account.entity';
import { Objective } from 'src/domains/objective.entity';
import { Organization } from 'src/domains/organization.entity';
import { Project } from 'src/domains/project.entity';
import { State } from 'src/domains/strategy.entity';
import { User } from 'src/domains/user.entity';

export class StrategyReadDto {
  id: string;
  strategyNumber: number;
  dateActive: Date;
  content: string;
  state: State;
  createdAt: Date;
  updatedAt: Date;
  user: User;
  account: Account;
  organization: Organization;
  objective: Objective;
  projects: Project[];
}
