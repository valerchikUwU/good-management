import { Entity, PrimaryColumn, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn, OneToOne } from 'typeorm';
import { Organization } from './organization.entity';
import { User } from './user.entity';
import { Goal } from './goal.entity';
import { Objective } from './objective.entity';
import { Policy } from './policy.entity';
import { Project } from './project.entity';
import { Strategy } from './strategy.entity';
import { Post } from './post.entity';
import { Statistic } from './statistic.entity';


@Entity()
export class Account {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({nullable: false})
    accountName: string;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
  
    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @OneToMany(() => User, (user) => user.account)
    users: User[];

    @OneToMany(() => Organization, (organization) => organization.account)
    organizations: Organization[];

    @OneToMany(() => Goal, (goal) => goal.account)
    goals: Goal[];

    @OneToMany(() => Objective, (objective) => objective.account)
    objectives: Objective[];

    @OneToMany(() => Policy, (policy) => policy.account)
    policies: Policy[];

    @OneToMany(() => Project, (project) => project.account)
    projects: Project[];

    @OneToMany(() => Strategy, (strategy) => strategy.account)
    strategies: Strategy[];

    @OneToMany(() => Post, (post) => post.account)
    posts: Post[];

    @OneToMany(() => Statistic, (statistic) => statistic.account)
    statistics: Statistic[];

}