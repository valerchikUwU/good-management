import { Account } from 'src/domains/account.entity';
import { TypeConvert } from 'src/domains/convert.entity';
import { ConvertToPost } from 'src/domains/convertToPost.entity';
import { Message } from 'src/domains/message.entity';
import { User } from 'src/domains/user.entity';

export class ConvertReadDto {
  id: string;
  convertTheme: string;
  pathOfPosts: string[];
  expirationTime: number;
  convertType: TypeConvert;
  activePostId: string;
  dateFinish: Date;
  createdAt: Date;
  messages: Message[];
  convertToPosts: ConvertToPost[];
  host: User;
  account: Account;
}
