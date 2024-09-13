import { Entity, PrimaryColumn, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, CreateDateColumn, UpdateDateColumn, Generated } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { RefreshSession } from './refreshSession.entity';
import { User } from './user.entity';
import { Organization } from './organization.entity';
import { Objective } from './objective.entity';
import { StrategyToOrganization } from './strategyToOrganization.entity';


enum State {
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

    @Column({nullable: false})
    path: string;

    @Column({nullable: false})
    size: number;

    @Column({nullable: false})
    mimetype: string;

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

    @OneToMany(() => StrategyToOrganization, (strategyToOrganization) => strategyToOrganization.strategy)
    strategyToOrganizations: StrategyToOrganization[]

    @OneToMany(() => Objective, (objective) => objective.strategy)
    objectives: Objective[]
}