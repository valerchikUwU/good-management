import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Account } from './account.entity';
import { User } from './user.entity';
import { Message } from './message.entity';
import { ConvertToUser } from './convertToUser.entity';

/**
 * Перечисление типов конвертов.
 */
export enum TypeConvert {
  /** Прямой тип конверта. */
  DIRECT = 'Прямой',
  /** Конвертация через приказ. */
  ORDER = 'Приказ',
  /** Конвертация для согласования. */
  COORDINATION = 'Согласование',
}

/**
 * Сущность Convert.
 * Представляет конверт для отправки документов между постами.
 */
@Entity()
export class Convert {
  /**
   * Уникальный идентификатор конвертации.
   * 
   * @remarks
   * Поле автоматически генерируется и имеет формат UUID v4.0.
   * 
   * @example
   * '550e8400-e29b-41d4-a716-446655440000'
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * Тема конвертации.
   * 
   * @remarks
   * nullable: false.
   * 
   * @example
   * 'Согласование новой политики'
   */
  @Column({ nullable: false })
  convertTheme: string;

  /**
   * Срок действия конвертации.
   * 
   * @remarks
   * nullable: false.
   * 
   * @example
   * '2024-06-30T23:59:59Z'
   */
  @Column({ nullable: false })
  expirationTime: string;

  /**
   * Список постов, через которые должен пройти конверт.
   * 
   * @remarks
   * Поле содержит массив UUID постов.
   * 
   * @example
   * ['123e4567-e89b-12d3-a456-426614174000', '550e8400-e29b-41d4-a716-446655440000']
   */
  @Column({ type: 'uuid', array: true, nullable: true })
  pathOfPosts: string[];

  /**
   * Тип конвертации.
   * 
   * @remarks
   * Использует перечисление TypeConvert. Поле может быть пустым.
   * 
   * @example
   * TypeConvert.DIRECT
   */
  @Column({
    type: 'enum',
    enum: TypeConvert,
    nullable: true,
  })
  convertType: TypeConvert;

  /**
   * Идентификатор пользователя, который должен подтвердить получение конверта.
   * 
   * @remarks
   * Ссылается на пользователя, выполняющего текущие действия.
   * 
   * @example
   * '123e4567-e89b-12d3-a456-426614174000'
   */
  @Column({ type: 'uuid', nullable: true })
  activeUserId: string;

  /**
   * Дата завершения конвертации.
   * 
   * @remarks
   * Поле заполняется при завершении процесса конвертации.
   * 
   * @example
   * '2024-06-10T08:15:30Z'
   */
  @Column({ type: 'timestamp', nullable: true })
  dateFinish: Date;

  /**
   * Дата и время создания конвертации.
   * 
   * @remarks
   * Поле автоматически заполняется при создании конверта.
   * 
   * @example
   * '2024-06-01T12:34:56Z'
   */
  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  /**
   * Связь с сообщениями (1:M Message).
   */
  @OneToMany(() => Message, (message) => message.convert)
  messages: Message[];

  /**
   * Связь с пользователями конвертации (1:M ConvertToUser).
   */
  @OneToMany(() => ConvertToUser, (convertToUser) => convertToUser.convert)
  convertToUsers: ConvertToUser[];

  /**
   * Связь с хостом конвертации (M:1 User).
   * 
   * @remarks
   * nullable: false.
   */
  @ManyToOne(() => User, (user) => user.convert, { nullable: false })
  host: User;

  /**
   * Связь с аккаунтом (M:1 Account).
   * 
   * @remarks
   * nullable: false.
   */
  @ManyToOne(() => Account, (account) => account.converts, { nullable: false })
  account: Account;
}
