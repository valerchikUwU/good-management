import { Entity, PrimaryColumn, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Target } from './target.entity';
import { ProjectToOrganization } from './projectToOrganization.entity';
import { Strategy } from './strategy.entity';
import { Account } from './account.entity';
import { User } from './user.entity';

export enum Type {
    PROJECT = 'Проект',
    PROGRAM = 'Программа'
}

@Entity()
export class Project{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({type: 'uuid', nullable: true})
    programId: string;

    @Column({type: 'text', nullable: false})
    content: string;

    @Column({
        type: 'enum',
        enum: Type,
        default: Type.PROJECT,
        nullable: false
    })
    type: Type;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
  
    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @OneToMany(() => ProjectToOrganization, (projectToOrganization) => projectToOrganization.project)
    projectToOrganizations: ProjectToOrganization[]

    @OneToMany(() => Target, (target) => target.project)
    targets: Target[]

    @ManyToOne(() => Strategy, (strategy) => strategy.projects, {nullable: false})
    strategy: Strategy

    @ManyToOne(() => Account, (account) => account.projects, {nullable: false})
    account: Account

    @ManyToOne(() => Account, (account) => account.users, {nullable: false})
    user: User
}