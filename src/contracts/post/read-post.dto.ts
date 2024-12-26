import { Account } from 'src/domains/account.entity';
import { ConvertToPost } from 'src/domains/convertToPost.entity';
import { HistoryUsersToPost } from 'src/domains/historyUsersToPost.entity';
import { Organization } from 'src/domains/organization.entity';
import { Policy } from 'src/domains/policy.entity';
import { Statistic } from 'src/domains/statistic.entity';
import { TargetHolder } from 'src/domains/targetHolder.entity';
import { User } from 'src/domains/user.entity';

export class PostReadDto {
  id: string;
  postName: string;
  divisionName: string;
  divisionNumber: number;
  parentId: string;
  product: string;
  purpose: string;
  createdAt: Date;
  updatedAt: Date;
  user: User;
  policy: Policy;
  statistics: Statistic[];
  organization: Organization;
  account: Account;
  historiesUsersToPost: HistoryUsersToPost[];
  targetHolders: TargetHolder[];
  convertToPosts: ConvertToPost[];
}
