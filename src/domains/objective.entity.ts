import { Entity, PrimaryColumn, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Strategy } from './strategy.entity';
import { Account } from './account.entity';


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

    @ManyToOne(() => Strategy, (strategy) => strategy.objectives, {nullable: false})
    strategy: Strategy

    @ManyToOne(() => Account, (account) => account.objectives, {nullable: false})
    account: Account
    
}