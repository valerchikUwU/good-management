import { Column, CreateDateColumn, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Post } from "./post.entity";
import { StatisticData } from "./statisticData.entity";

export enum Type {
    DIRECT = 'Прямая',
    REVERSE = 'Перевернутая'
}

@Entity()
export class Statistic{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    
    @Column({
        type: 'enum',
        enum: Type,
        default: Type.DIRECT,
        nullable: false
    })
    type: Type;

    @Column({type: 'text', nullable: false})
    name: string;

    @Column({type: 'text', nullable: false})
    description: string

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
  
    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @OneToOne(() => StatisticData, (statisticData) => statisticData.statistic)
    statisticData: StatisticData;

    @ManyToOne(() => Post, (post) => post.statistics)
    post: Post;
}