import { Account } from 'src/domains/account.entity';
import { ControlPanel } from 'src/domains/controlPanel.entity';
import { Convert } from 'src/domains/convert.entity';
import { ConvertToPost } from 'src/domains/convertToPost.entity';
import { HistoryUsersToPost } from 'src/domains/historyUsersToPost.entity';
import { Message } from 'src/domains/message.entity';
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
  convert: Convert;
  historiesUsersToPost: HistoryUsersToPost[];
  targetHolders: TargetHolder[];
  convertToPosts: ConvertToPost[];
  messages: Message[];
  controlPanels: ControlPanel[];
}
