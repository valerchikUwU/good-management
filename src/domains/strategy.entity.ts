import { Entity, PrimaryColumn, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, CreateDateColumn, UpdateDateColumn, Generated, OneToOne } from 'typeorm';
import { User } from './user.entity';
import { Objective } from './objective.entity';
import { StrategyToOrganization } from './strategyToOrganization.entity';
import { Project } from './project.entity';
import { Account } from './account.entity';


export enum State {
    DRAFT = 'Черновик',
    ACTIVE = 'Активный',
    REJECTED = 'Завершено'
}

@Entity()
export class Strategy{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    @Generated('increment')
    strategyNumber: number;

    @Column({nullable: false})
    strategyName: string;

    @Column({type: 'timestamp', nullable: true})
    dateActive: Date

    @Column({type: 'text', nullable: false})
    content: string

    @Column({
        type: 'enum',
        enum: State,
        default: State.DRAFT,
        nullable: false
    })
    state: State;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
  
    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @ManyToOne(() => User, (user) => user.strategies, {nullable: false})
    user: User

    @ManyToOne(() => Account, (account) => account.strategies, {nullable: false})
    account: Account

    @OneToMany(() => StrategyToOrganization, (strategyToOrganization) => strategyToOrganization.strategy)
    strategyToOrganizations: StrategyToOrganization[]

    @OneToOne(() => Objective, (objective) => objective.strategy)
    objective: Objective
    
    @OneToMany(() => Project, (project) => project.strategy)
    projects: Project[]
}