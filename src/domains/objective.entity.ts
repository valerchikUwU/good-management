import { Entity, PrimaryColumn, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Account } from './account.entity';
import { User } from './user.entity';
import { Post } from './post.entity';
import { Strategy } from './strategy.entity';
import { ObjectiveToOrganization } from './objectiveToOrganization.entity';


@Entity()
export class Objective{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({nullable: false})
    orderNumber: number;

    @Column({type: 'text', nullable: false})
    situation: string;

    @Column({type: 'text', nullable: false})
    content: string

    @Column({type: 'text', nullable: false})
    rootCause: string;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
  
    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @OneToMany(() => ObjectiveToOrganization, (objectiveToOrganization) => objectiveToOrganization.objective)
    objectiveToOrganizations: ObjectiveToOrganization[]

    @ManyToOne(() => Strategy, (strategy) => strategy.objectives, {nullable: false})
    strategy: Strategy
}