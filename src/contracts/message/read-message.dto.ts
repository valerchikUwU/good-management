import { Convert } from 'src/domains/convert.entity';
import { Post } from 'src/domains/post.entity';

export class MessageReadDto {
  id: string;

  content: string;

  timeSeen: Date;

  createdAt: Date;

  updatedAt: Date;

  convert: Convert;

  sender: Post;
}
