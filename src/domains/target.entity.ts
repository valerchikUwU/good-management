import { Entity, PrimaryColumn, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, CreateDateColumn, UpdateDateColumn, OneToOne, Index } from 'typeorm';
import { TargetHolder } from './targetHolder.entity';
import { Project } from './project.entity';

export enum Type {
    COMMON = 'Обычная',
    STATISTIC = 'Статистика',
    RULE = 'Правила',
    PRODUCT = 'Продукт'
}

export enum State {
    ACTIVE = 'Активная',
    REJECTED = 'Отменена',
    FINISHED = 'Завершена'
}
@Entity()
export class Target{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'enum',
        enum: Type,
        default: Type.COMMON,
        nullable: false
    })
    type: Type;

    @Column({nullable: false})
    orderNumber: number;

    @Column({type: 'text', nullable: false})
    content: string;

    @Column({type: 'uuid', nullable: false})
    holderUserId: string;

    @Column({
        type: 'enum',
        enum: State,
        default: State.ACTIVE,
        nullable: false
    })
    targetState: State;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', nullable: false})
    dateStart: Date

    @Column({ type: 'timestamp', nullable: true})
    deadline: Date

    @Column({ type: 'timestamp', nullable: true})
    dateComplete: Date

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
  
    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @OneToMany(() => TargetHolder, (targetHolder) => targetHolder.target)
    targetHolders: TargetHolder[];

    @ManyToOne(() => Project, (project) => project.targets, {nullable: true}) //хуй знает
    @Index() // Добавляем индекс для поля project
    project: Project

}