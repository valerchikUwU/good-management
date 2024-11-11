import {
  CreateDateColumn,
  Entity,
  Index,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Organization } from './organization.entity';
import { Policy } from './policy.entity';
import { User } from './user.entity';
import { Group } from './group.entity';

@Entity()
export class GroupToUser {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.groupToUsers)
  @Index() // Добавляем индекс для поля user
  user: User;

  @ManyToOne(() => Group, (group) => group.groupToUsers)
  @Index() // Добавляем индекс для поля group
  group: Group;
}
