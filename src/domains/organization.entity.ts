import { Entity, PrimaryColumn, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, CreateDateColumn, UpdateDateColumn, OneToOne } from 'typeorm';
import { Account } from './account.entity';
import { User } from './user.entity';
import { Post } from './post.entity';
import { PolicyToOrganization } from './policyToOrganization.entity';
import { Goal } from './goal.entity';
import { Strategy } from './strategy.entity';
import { Project } from './project.entity';


@Entity()
export class Organization {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({nullable: false})
    organizationName: string;

    @Column({type: 'uuid', nullable: true})
    parentOrganizationId: string

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
  
    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @OneToOne(() => Goal, (goal) => goal.organization)
    goal: Goal

    @OneToMany(() => User, (user) => user.organization)
    users: User[];

    @OneToMany(() => Post, (post) => post.organization)
    posts: Post[];

    @OneToMany(() => PolicyToOrganization, (policyToOrganization) => policyToOrganization.organization)
    policyToOrganizations: PolicyToOrganization[]

    @OneToMany(() => Project, (project) => project.organization)
    projects: Project[];

    @OneToMany(() => Strategy, (strategy) => strategy.organization)
    strategies: Strategy[];

    @ManyToOne(() => Account, (account) => account.organizations, {nullable: false})
    account: Account;
}