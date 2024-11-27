import {
  Entity,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  OneToOne,
  Index,
  Generated,
} from 'typeorm';
import { User } from './user.entity';
import { Organization } from './organization.entity';
import { Policy } from './policy.entity';
import { Statistic } from './statistic.entity';
import { Account } from './account.entity';
import { HistoryUsersToPost } from './historyUsersToPost.entity';

@Entity()
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  postName: string;

  @Column({ nullable: false, default: 'Подразделение' })
  divisionName: string;

  @Column()
  @Generated('increment')
  divisionNumber: number;

  @Column({ type: 'uuid', nullable: true })
  parentId: string;

  @Column({ type: 'text', nullable: false })
  product: string;

  @Column({ type: 'text', nullable: false })
  purpose: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.posts, { nullable: true })
  @Index() // Добавляем индекс для поля user
  user: User;

  @ManyToOne(() => Policy, (policy) => policy.posts, { nullable: true })
  @Index() // Добавляем индекс для поля policy
  policy: Policy;

  @ManyToOne(() => Organization, (organization) => organization.posts, {
    nullable: true,
  })
  @Index() // Добавляем индекс для поля organization
  organization: Organization;

  @ManyToOne(() => Account, (account) => account.posts, { nullable: false })
  account: Account;

  @OneToMany(() => Statistic, (statistic) => statistic.post)
  statistics: Statistic[];

  @OneToMany(() => HistoryUsersToPost, (historyUsersToPost) => historyUsersToPost.post)
  historiesUsersToPost: HistoryUsersToPost[];
}
