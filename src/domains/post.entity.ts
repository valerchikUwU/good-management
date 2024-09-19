import { Entity, PrimaryColumn, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn, OneToOne } from 'typeorm';
import { User } from './user.entity';
import { Organization } from './organization.entity';
import { Policy } from './policy.entity';
import { Statistic } from './statistic.entity';
import { Account } from './account.entity';


@Entity()
export class Post {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({nullable: false})
    postName: string;

    @Column({nullable: true})
    divisionName: string;

    @Column({type: 'uuid', nullable: true})
    parentId: string;

    @Column({type: 'text', nullable: false})
    product: string

    @Column({type: 'text', nullable: false})
    purpose: string


    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
  
    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @OneToOne(() => User, user => user.post, {nullable: false})
    @JoinColumn()
    user: User;

    @OneToOne(() => Policy, (policy) => policy.post, {nullable: true})
    @JoinColumn()
    policy: Policy;

    @OneToMany(() => Statistic, (statistic) => statistic.post)
    statistics: Statistic[]


    @ManyToOne(() => Organization, organization => organization.posts, {nullable: false})
    organization: Organization

    @ManyToOne(() => Account, account => account.posts, {nullable: false})
    account: Account

}