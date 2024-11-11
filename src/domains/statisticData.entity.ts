import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Post } from './post.entity';
import { Statistic } from './statistic.entity';

@Entity()
export class StatisticData {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  value: number;

  @Column({
    type: 'timestamp',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  valueDate: Date;

  @Column({ nullable: false, default: false })
  isCorrelation: boolean;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @ManyToOne(() => Statistic, (statistic) => statistic.statisticDatas, {
    eager: false,
  })
  statistic: Statistic;
}
