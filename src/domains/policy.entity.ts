import { Entity, PrimaryColumn, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, CreateDateColumn, UpdateDateColumn, OneToOne, Generated } from 'typeorm';
import { RefreshSession } from './refreshSession.entity';
import { User } from './user.entity';
import { Organization } from './organization.entity';
import { PolicyToOrganization } from './policyToOrganization.entity';
import { Post } from './post.entity';
import { Account } from './account.entity';

export enum State {
    DRAFT = 'Черновик',
    ACTIVE = 'Активный',
    REJECTED = 'Отменён'
}


export enum Type {
    DIRECTIVE = 'Директива',
    INSTRUCTION = 'Инструкция'
}
@Entity()
export class Policy{
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({nullable: false})
    policyName: string

    
    @Column()
    @Generated('increment')
    policyNumber: number;

    @Column({
        type: 'enum',
        enum: State,
        default: State.DRAFT,
        nullable: false
    })
    state: State;

    @Column({
        type: 'enum',
        enum: Type,
        nullable: false 
    })
    type: Type;
    
    @Column({type: 'timestamp', nullable: true})
    dateActive: Date

    @Column({type: 'text', nullable: false})
    content: string;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
  
    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @OneToOne(() => Post, (post) => post.policy)
    post: Post;

    @OneToMany(() => PolicyToOrganization, (policyToOrganization) => policyToOrganization.policy)
    policyToOrganizations: PolicyToOrganization[]

    @ManyToOne(() => User, (user) => user.policies, {nullable: false})
    user: User

    @ManyToOne(() => Account, (account) => account.policies, {nullable: false})
    account: Account
}