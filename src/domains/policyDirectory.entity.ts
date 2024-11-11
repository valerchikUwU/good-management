import {
  Entity,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  Generated,
} from 'typeorm';
import { Policy } from './policy.entity';
import { PolicyToPolicyDirectory } from './policyToPolicyDirectories.entity';
import { Account } from './account.entity';

@Entity()
export class PolicyDirectory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  directoryName: string;

  @OneToMany(
    () => PolicyToPolicyDirectory,
    (policyToPolicyDirectory) => policyToPolicyDirectory.policyDirectory,
  )
  policyToPolicyDirectories: PolicyToPolicyDirectory[];

  @ManyToOne(() => Account, (account) => account.policies, { nullable: false })
  account: Account;
}
