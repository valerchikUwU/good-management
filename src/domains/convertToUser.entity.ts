import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Convert } from './convert.entity';

export enum UserType {
  WATCHER = 'Наблюдатель',
  RECIEVER = 'Получатель',
}

@Entity()
export class ConvertToUser {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  // @Column({
  //     type: 'enum',
  //     enum: UserType,
  //     nullable: false
  // })
  // userType: UserType;

  @ManyToOne(() => User, (user) => user.convertToUsers)
  @Index() // Добавляем индекс для поля policy
  user: User;

  @ManyToOne(() => Convert, (convert) => convert.convertToUsers)
  @Index() // Добавляем индекс для поля organization
  convert: Convert;
}
