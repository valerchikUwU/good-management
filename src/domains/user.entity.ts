import { Entity, PrimaryColumn, PrimaryGeneratedColumn, Column } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';


@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50 })
  firstName: string;

  @Column({ length: 50 })
  lastName: string;

  @Column({ nullable: true })
  telegramId: number;

  @Column({ nullable: true })
  telephoneNumber: string;

  @Column({ nullable: true })
  avatar_url: string;

  @Column({
    nullable: true,
  })
  vk_id: number;
}