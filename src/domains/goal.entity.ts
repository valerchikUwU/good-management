import { Entity, PrimaryColumn, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from './user.entity';
import { Organization } from './organization.entity';
import { GoalToOrganization } from './goalToOrganization.entity';
import { Exclude } from 'class-transformer';
import { Account } from './account.entity';


@Entity()
export class Goal{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({nullable: false})
    goalName: string;

    @Column({nullable: false, default: 1})
    orderNumber: number;

    @Column({type: 'text', nullable: false})
    content: string;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
  
    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;
    
    @ManyToOne(() => User, (user) => user.goals, {nullable: false})
    user: User

    @ManyToOne(() => Account, (account) => account.goals, {nullable: false})
    account: Account

    @OneToMany(() => GoalToOrganization, (goalToOrganization) => goalToOrganization.goal)
    goalToOrganizations: GoalToOrganization[]

}