import {
  Entity,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  OneToOne,
  Index,
} from 'typeorm';
import { Strategy } from './strategy.entity';
import { Account } from './account.entity';

@Entity()
export class Objective {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', array: true, nullable: true })
  situation: string[];

  @Column({ type: 'text', array: true, nullable: true })
  content: string[];

  @Column({ type: 'text', array: true, nullable: true })
  rootCause: string[];

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @OneToOne(() => Strategy, (strategy) => strategy.objective, {
    nullable: false,
  })
  @JoinColumn()
  @Index() // Добавляем индекс на поле strategy
  strategy: Strategy;

  @ManyToOne(() => Account, (account) => account.objectives, {
    nullable: false,
  })
  account: Account;
}
