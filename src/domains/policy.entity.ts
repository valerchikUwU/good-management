import { Entity, PrimaryColumn, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { RefreshSession } from './refreshSession.entity';
import { User } from './user.entity';
import { Organization } from './organization.entity';
import { PolicyToOrganization } from './policyToOrganization.entity';

export enum State {
    DRAFT = 'Черновик',
    ACTIVE = 'Активный',
    REJECTED = 'Отменён'
}

@Entity()
export class Policy{
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({nullable: false})
    policyName: string

    @Column({
        type: 'enum',
        enum: State,
        default: State.DRAFT,
        nullable: false
    })
    state: State;

    
    @Column({type: 'timestamp', nullable: true})
    dateActive: Date

    @Column({nullable: false})
    path: string;

    @Column({nullable: false})
    size: number;

    @Column({nullable: false})
    mimetype: string;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
  
    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @OneToMany(() => PolicyToOrganization, (policyToOrganization) => policyToOrganization.policy)
    policyToOrganizations: PolicyToOrganization[]

    @ManyToOne(() => User, (user) => user.policies, {nullable: false})
    user: User
}