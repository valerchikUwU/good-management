import { Entity, PrimaryColumn, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, CreateDateColumn, UpdateDateColumn, OneToOne } from 'typeorm';
import { TargetHolder } from './targetHolder.entity';
import { Project } from './project.entity';

export enum Type {
    COMMON = 'Обычная',
    STATISTIC = 'Статистика',
    RULE = 'Правила',
    PRODUCT = 'Продукт'
}

@Entity()
export class Target{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'enum',
        enum: Type,
        nullable: false
    })
    type: Type;

    @Column({nullable: true})
    commonNumber: number;

    @Column({nullable: true})
    statisticNumber: number;

    @Column({nullable: true})
    ruleNumber: number;

    @Column({nullable: true})
    productNumber: number;

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