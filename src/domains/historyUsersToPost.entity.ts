import {
    CreateDateColumn,
    Entity,
    Index,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
  } from 'typeorm';
import { Post } from './post.entity';
import { User } from './user.entity';
  
  @Entity()
  export class HistoryUsersToPost {
    @PrimaryGeneratedColumn('uuid')
    public id: string;
  
    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
  
    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;
  
    @ManyToOne(() => Post, (post) => post.historiesUsersToPost)
    @Index() // Добавляем индекс для поля policy
    post: Post;
  
    @ManyToOne(() => User, (user) => user.historiesUsersToPost)
    user: User;
  }
  