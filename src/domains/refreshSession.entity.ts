import { Entity, PrimaryColumn, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { IsInt, IsIP, IsString } from 'class-validator';


@Entity()
export class RefreshSession {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @IsString()
  @Column({ length: 200 })
  user_agent: string;

  @IsString()
  @Column({ length: 200 })
  fingerprint: string;

  @IsIP()
  @Column({ nullable: true })
  ip: string;

  @IsInt()
  @Column({ nullable: true })
  expiresIn: number;

  @IsString()
  @Column()
  refreshToken: string;

  @ManyToOne(() => User, (user) => user.refreshSessions)
  user: User;

}