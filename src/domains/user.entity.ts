import { Entity, PrimaryColumn, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { RefreshSession } from './refreshSession.entity';


@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50 })
  firstName: string;

  @Column({ length: 50 })
  lastName: string;

  @Column({ nullable: true })
  telegramId: number | null;

  @Column({ nullable: true })
  telephoneNumber: string | null;

  @Column({ nullable: true })
  avatar_url: string | null;

  @Column({
    nullable: true,
  })
  vk_id: number | null;

  @OneToMany(() => RefreshSession, (refreshSession) => refreshSession.user)
  refreshSessions: RefreshSession[];
}