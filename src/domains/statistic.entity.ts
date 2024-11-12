import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Post } from './post.entity';
import { StatisticData } from './statisticData.entity';
import { Account } from './account.entity';

export enum Type {
  DIRECT = 'Прямая',
  REVERSE = 'Обратная',
}

@Entity()
export class Statistic {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: Type,
    default: Type.DIRECT,
    nullable: false,
  })
  type: Type;

  @Column({ type: 'text', nullable: false })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @OneToMany(() => StatisticData, (statisticData) => statisticData.statistic)
  statisticDatas: StatisticData[];

  @ManyToOne(() => Post, (post) => post.statistics)
  post: Post;

  @ManyToOne(() => Account, (account) => account.statistics, {
    nullable: false,
  })
  account: Account;
}

