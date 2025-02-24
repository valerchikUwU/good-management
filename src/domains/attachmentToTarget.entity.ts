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
import { Attachment } from './attachment.entity';
import { Target } from './target.entity';

@Entity()
export class AttachmentToTarget {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @ManyToOne(() => Attachment, (attachment) => attachment.attachmentToTargets)
  @Index() 
  attachment: Attachment;

  @ManyToOne(() => Target, (target) => target.attachmentToTargets, {onDelete: 'CASCADE'})
  @Index() 
  target: Target;
}
