import { Convert } from 'src/domains/convert.entity';
import { Post } from 'src/domains/post.entity';

export class MessageReadDto {
  id: string;

  content: string;

  convert: Convert;

  sender: Post;
}
