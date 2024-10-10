import { Entity, PrimaryColumn, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Organization } from './organization.entity';
import { Exclude } from 'class-transformer';
import { Account } from './account.entity';


@Entity()
export class Goal{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({type: 'text', array: true, nullable: false})
    content: string[];

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
  
    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;
    
    @ManyToOne(() => User, (user) => user.goals, {nullable: false})
    user: User;

    @ManyToOne(() => Account, (account) => account.goals, {nullable: false})
    account: Account;

    @OneToOne(() => Organization, (organization) => organization.goal)
    @JoinColumn()
    organization: Organization;

}