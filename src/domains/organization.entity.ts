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
} from 'typeorm';
import { Account } from './account.entity';
import { User } from './user.entity';
import { Post } from './post.entity';
import { Goal } from './goal.entity';
import { Strategy } from './strategy.entity';
import { Project } from './project.entity';
import { Policy } from './policy.entity';

export enum ReportDay {
  MONDAY = 1,
  TUESDAY = 2,
  WEDNESDAY = 3,
  THURSDAY = 4,
  FRIDAY = 5,
  SUNDAY = 6,
  SATURDAY = 0,
}

@Entity()
export class Organization {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  organizationName: string;

  @Column({ type: 'uuid', nullable: true })
  parentOrganizationId: string;

  @Column({
    type: 'enum',
    enum: ReportDay,
    default: ReportDay.FRIDAY,
    nullable: false,
  })
  reportDay: ReportDay;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @OneToOne(() => Goal, (goal) => goal.organization)
  goal: Goal;

  @OneToMany(() => User, (user) => user.organization)
  users: User[];

  @OneToMany(() => Post, (post) => post.organization)
  posts: Post[];

  @OneToMany(
    () => Policy,
    (policy) => policy.organization,
  )
  policies: Policy[];

  @OneToMany(() => Project, (project) => project.organization)
  projects: Project[];

  @OneToMany(() => Strategy, (strategy) => strategy.organization)
  strategies: Strategy[];

  @ManyToOne(() => Account, (account) => account.organizations, {
    nullable: false,
  })
  account: Account;
}
