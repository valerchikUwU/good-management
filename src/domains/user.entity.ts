import { Entity, PrimaryColumn, PrimaryGeneratedColumn, Column, OneToMany, OneToOne, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { RefreshSession } from './refreshSession.entity';
import { Post } from './post.entity';
import { Organization } from './organization.entity';
import { Goal } from './goal.entity';
import { Policy } from './policy.entity';
import { Strategy } from './strategy.entity';
import { TargetHolder } from './targetHolder.entity';
import { Account } from './account.entity';


@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50, nullable: true })
  firstName: string;

  @Column({ length: 50, nullable: true  })
  lastName: string;

  @Column({ nullable: true })
  telegramId: number | null;

  @Column({ nullable: true })
  telephoneNumber: string | null;

  @Column({ nullable: true })
  avatar_url: string | null;

  @Column({
    nullable: true,
  })
  vk_id: number | null;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;





   
  @OneToOne(() => Post, (post) => post.user)
  post: Post;

  @OneToMany(() => RefreshSession, (refreshSession) => refreshSession.user)
  refreshSessions: RefreshSession[];

  @OneToMany(() => Goal, (goal) => goal.user)
  goals: Goal[];

  @OneToMany(() => Policy, (policy) => policy.user)
  policies: Policy[];

  @OneToMany(() => Strategy, (strategy) => strategy.user)
  strategies: Strategy[];

  @OneToMany(() => TargetHolder, (targetHolder) => targetHolder.user)
  targetHolders: TargetHolder[];

  @ManyToOne(() => Organization, (organization) => organization.users, {nullable: false})
  organization: Organization;

  @ManyToOne(() => Account, (account) => account.user, {nullable: false})
  account: Account;
}