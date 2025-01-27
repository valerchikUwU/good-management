import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  Generated,
  OneToOne,
} from 'typeorm';
import { User } from './user.entity';
import { Organization } from './organization.entity';
import { Policy } from './policy.entity';
import { Statistic } from './statistic.entity';
import { Account } from './account.entity';
import { HistoryUsersToPost } from './historyUsersToPost.entity';
import { TargetHolder } from './targetHolder.entity';
import { ConvertToPost } from './convertToPost.entity';
import { Convert } from './convert.entity';
import { Message } from './message.entity';
import { ControlPanel } from './controlPanel.entity';
import { Target } from './target.entity';

/**
 * Сущность, представляющая должность (пост).
 */
@Entity()
export class Post {

  /**
   * Уникальный идентификатор.
   * 
   * @remarks
   * Поле автоматически генерируется в формате UUID v4.0.
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;


  /**
   * Название поста.
   * 
   * @remarks
   * nullable: false.
   */
  @Column({ nullable: false })
  postName: string;

  /**
   * Название отдела.
   * 
   * @remarks
   * При наличии parentId устанавливается post.divisionName WHERE id = parentId (т.е. отдел родительского поста), default: "Подразделение", nullable: false.
   */
  @Column({ nullable: false, default: 'Подразделение' })
  divisionName: string;

  /**
   * Порядковый номер отдела.
   * 
   * @remarks
   * Инкремент в БД. Нужен для автогенерации названия отдела при отсутствии parentId, т.е. на клиенте будет, например, "Подразделение 2"
   */
  @Column({ nullable: false })
  divisionNumber: number;

  /**
   * Id родительского поста.
   * 
   * @remarks
   * UUID v4.0, nullable: true
   */
  @Column({ type: 'uuid', nullable: true })
  parentId: string;

  /**
   * Продукт поста.
   * 
   * @remarks
   * nullable: false
   */
  @Column({ type: 'text', nullable: false })
  product: string;

  /**
   * Цель поста.
   * 
   * @remarks
   * nullable: false
   */
  @Column({ type: 'text', nullable: false })
  purpose: string;

  /**
   * Дата создания записи.
   * 
   * @remarks
   * Поле автоматически заполняется при создании записи.
   * 
   * @example
   * '2024-06-01T12:34:56Z'
   */
  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;


  /**
   * Дата последнего обновления записи.
   * 
   * @remarks
   * Поле автоматически обновляется при изменении записи.
   * 
   * @example
   * '2024-06-01T12:34:56Z'
   */
  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;


  /**
   * Связь с сущностью 1:1 Goal.
   */
  @OneToOne(() => Target, (target) => target.senderPost)
  target: Target;

  /**
   * Связь с сущностью М:1 User.
   * 
   * @remarks
   * Установлен индекс, nullable: true (не назначили человека на пост).
   */
  @ManyToOne(() => User, (user) => user.posts, { nullable: true })
  @Index() // Добавляем индекс для поля user
  user: User;

  /**
   * Связь с сущностью М:1 Policy.
   * 
   * @remarks
   * Установлен индекс, nullable: true.
   */
  @ManyToOne(() => Policy, (policy) => policy.posts, { nullable: true })
  @Index() // Добавляем индекс для поля policy
  policy: Policy;

  /**
   * Связь с сущностью М:1 Organization.
   * 
   * @remarks
   * Установлен индекс, nullable: true (????????).
   */
  @ManyToOne(() => Organization, (organization) => organization.posts, {
    nullable: true,
  })
  @Index() // Добавляем индекс для поля organization
  organization: Organization;

  /**
   * Связь с сущностью М:1 Account.
   * 
   * @remarks
   * nullable: false.
   */
  @ManyToOne(() => Account, (account) => account.posts, { nullable: false })
  account: Account;

  /**
   * Связь с сущностью 1:M Convert.
   */
  @OneToMany(() => Convert, (convert) => convert.host)
  convert: Convert;

  /**
   * Связь с сущностью 1:M Statistic.
   */
  @OneToMany(() => Statistic, (statistic) => statistic.post)
  statistics: Statistic[];

  /**
   * Связь с сущностью 1:M HistoryUsersToPost.
   */
  @OneToMany(() => HistoryUsersToPost, (historyUsersToPost) => historyUsersToPost.post)
  historiesUsersToPost: HistoryUsersToPost[];

  /**
   * Связь с сущностью 1:M TargetHolder.
   */
  @OneToMany(() => TargetHolder, (targetHolder) => targetHolder.post)
  targetHolders: TargetHolder[];

  /**
   * Связь с сущностью 1:M ConvertToPost.
   */
  @OneToMany(() => ConvertToPost, (convertToPost) => convertToPost.post)
  convertToPosts: ConvertToPost[];


  /**
   * Связь с сущностью 1:M Message.
   */
  @OneToMany(() => Message, (message) => message.sender)
  messages: Message[];

  /**
   * Связь с сущностью 1:M ControlPanel.
   */
  @OneToMany(() => ControlPanel, (controlPanel) => controlPanel.post)
  controlPanels: ControlPanel[];
}
