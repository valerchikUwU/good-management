import {
  Entity,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { IsInt, IsIP, IsString } from 'class-validator';

@Entity()
export class RefreshSession {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @IsString()
  @Column({ length: 200, nullable: false })
  user_agent: string;

  @IsString()
  @Column({ length: 200, nullable: false })
  fingerprint: string;

  @IsIP()
  @Column({ nullable: false })
  ip: string;

  @IsInt()
  @Column({ nullable: false })
  expiresIn: number;

  @IsString()
  @Column({ nullable: false })
  refreshToken: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.refreshSessions)
  user: User;
}
