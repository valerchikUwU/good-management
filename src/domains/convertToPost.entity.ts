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
import { Convert } from './convert.entity';
import { Post } from './post.entity';

export enum UserType {
  WATCHER = 'Наблюдатель',
  RECIEVER = 'Получатель',
}

@Entity()
export class ConvertToPost {
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

  @ManyToOne(() => Post, (post) => post.convertToPosts)
  @Index() // Добавляем индекс для поля policy
  post: Post;

  @ManyToOne(() => Convert, (convert) => convert.convertToPosts)
  @Index() // Добавляем индекс для поля organization
  convert: Convert;
}
