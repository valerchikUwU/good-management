import {
  Entity,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { User } from './user.entity';
import { RoleSetting } from './roleSetting.entity';

export enum Roles {
  OWNER = 'Собственник',
  ADMIN = 'Админ',
  HELPER = 'Помощник',
  DIRECTOR = 'Директор',
  MANAGER = 'Руководитель',
  EMPLOYEE = 'Сотрудник',
}

@Entity()
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: Roles,
    nullable: false,
  })
  roleName: Roles;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @OneToMany(() => RoleSetting, (roleSetting) => roleSetting.role)
  roleSettings: RoleSetting[];

  @OneToMany(() => User, (user) => user.role)
  users: User[];
}
