import { Entity, PrimaryColumn, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, CreateDateColumn, UpdateDateColumn, OneToOne } from 'typeorm';
import { TargetHolder } from './targetHolder.entity';
import { Project } from './project.entity';

export enum Type {
    WORK = 'Обычная',
    METRIC = 'Статистика',
    RULE = 'Правила',
    MAIN = 'Продукт'
}

@Entity()
export class Target{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'enum',
        enum: Type,
        default: Type.WORK,
        nullable: false
    })
    type: Type;

    @Column({nullable: false, default: 1})
    orderNumber: number;

    @Column({type: 'text', nullable: false})
    content: string;

    @Column({ type: 'timestamp', nullable: false})
    dateStart: Date

    @Column({ type: 'timestamp', nullable: false})
    deadline: Date

    @Column({ type: 'timestamp', nullable: true})
    dateComplete: Date

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
  
    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @OneToOne(() => TargetHolder, (targetHolder) => targetHolder.target)
    targetHolder: TargetHolder;

    @ManyToOne(() => Project, (project) => project.targets) //хуй знает
    project: Project
}