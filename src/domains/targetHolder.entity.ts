import {
  Entity,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from './user.entity';
import { Target } from './target.entity';

@Entity()
// @Index(['target', 'user'], { unique: true }) шо то я запутался надо чи нет
export class TargetHolder {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @ManyToOne(() => Target, (target) => target.targetHolders, {
    nullable: false,
  })
  @Index() // Добавляем индекс для поля target
  target: Target;

  @Index() // Добавляем индекс для поля user
  @ManyToOne(() => User, (user) => user.targetHolders, { nullable: false })
  user: User;
}
