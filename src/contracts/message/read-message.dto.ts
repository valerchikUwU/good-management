import { Convert } from 'src/domains/convert.entity';
import { User } from 'src/domains/user.entity';

export class MessageReadDto {
  id: string;

  content: string;

  convert: Convert;

  sender: User;
}
