import { Entity, PrimaryColumn, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Account } from './account.entity';
import { User } from './user.entity';
import { Post } from './post.entity';
import { GoalToOrganization } from './goalToOrganization.entity';
import { PolicyToOrganization } from './policyToOrganization.entity';
import { ProjectToOrganization } from './projectToOrganization.entity';
import { StrategyToOrganization } from './strategyToOrganization.entity';


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

    @OneToMany(() => User, (user) => user.organization)
    users: User[];

    @OneToMany(() => Post, (post) => post.organization)
    posts: Post[];

    @OneToMany(() => GoalToOrganization, (goalToOrganization) => goalToOrganization.organization)
    goalToOrganizations: GoalToOrganization[]

    @OneToMany(() => PolicyToOrganization, (policyToOrganization) => policyToOrganization.organization)
    policyToOrganizations: PolicyToOrganization[]

    @OneToMany(() => ProjectToOrganization, (projectToOrganization) => projectToOrganization.organization)
    projectToOrganizations: ProjectToOrganization[]

    @OneToMany(() => StrategyToOrganization, (strategyToOrganization) => strategyToOrganization.organization)
    strategyToOrganizations: StrategyToOrganization[]

    @ManyToOne(() => Account, (account) => account.organizations, {nullable: false})
    account: Account;
}