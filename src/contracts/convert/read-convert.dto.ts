import { Account } from 'src/domains/account.entity';
import { PathConvert, TypeConvert } from 'src/domains/convert.entity';
import { ConvertToPost } from 'src/domains/convertToPost.entity';
import { Message } from 'src/domains/message.entity';
import { Post } from 'src/domains/post.entity';

export class ConvertReadDto {
  id: string;
  convertTheme: string;
  pathOfPosts: string[];
  expirationTime: number;
  convertType: TypeConvert;
  convertPath: PathConvert;
  convertStatus: boolean;
  activePostId: string;
  dateFinish: Date;
  createdAt: Date;
  messages: Message[];
  convertToPosts: ConvertToPost[];
  host: Post;
  account: Account;
}
