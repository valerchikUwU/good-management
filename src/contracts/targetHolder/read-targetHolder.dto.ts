import { Target } from 'src/domains/target.entity';
import { User } from 'src/domains/user.entity';

export class TargetHolderReadDto {
  id: string;
  target: Target;
  user: User;
}
