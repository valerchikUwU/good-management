import { Entity, PrimaryColumn, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn, OneToOne } from 'typeorm';
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

    @OneToOne(() => Strategy, (strategy) => strategy.objective, {nullable: false})
    @JoinColumn()
    strategy: Strategy

    @ManyToOne(() => Account, (account) => account.objectives, {nullable: false})
    account: Account
    
}