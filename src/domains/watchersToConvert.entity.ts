import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { Convert } from './convert.entity';
import { Post } from './post.entity';

@Entity()
export class WatchersToConvert {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Convert, (convert) => convert.watchersToConvert, { nullable: false, onDelete: 'CASCADE' })
  convert: Convert;

  @ManyToOne(() => Post, { nullable: false, onDelete: 'CASCADE' })
  post: Post;

  /**
   * Количество непрочитанных сообщений для данного наблюдателя.
   */
  @Column({ type: 'int', default: 0 })
  unreadMessagesCount: number;

  /**
   * Дата последнего просмотра чата.
   */
  @Column({ type: 'int', nullable: true })
  lastSeenNumber: number;
}
