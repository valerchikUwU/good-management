import { Entity, PrimaryColumn, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, CreateDateColumn, UpdateDateColumn, Generated, Index } from 'typeorm';
import { Target } from './target.entity';
import { Strategy } from './strategy.entity';
import { Account } from './account.entity';
import { User } from './user.entity';
import { Organization } from './organization.entity';

export enum Type {
    PROJECT = 'Проект',
    PROGRAM = 'Программа'
}

@Entity()
export class Project{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    @Generated('increment')
    projectNumber: number;

    @Column({ length: 50, default: 'Название проекта', nullable: false  })
    projectName: string;

    @Column({type: 'uuid', nullable: true})
    programId: string;

    @Column({type: 'text', nullable: true})
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

    @ManyToOne(() => Organization, (organization) => organization.projects)
    organization: Organization

    @OneToMany(() => Target, (target) => target.project)
    targets: Target[]

    @ManyToOne(() => Strategy, (strategy) => strategy.projects, {nullable: true})
    @Index() // Добавляем индекс для поля strategy
    strategy: Strategy

    @ManyToOne(() => Account, (account) => account.projects, {nullable: false})
    account: Account

    @ManyToOne(() => User, (user) => user.projects, {nullable: false})
    user: User
}

// добавить state