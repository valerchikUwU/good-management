import {
  CreateDateColumn,
  Entity,
  Index,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Organization } from './organization.entity';
import { Policy } from './policy.entity';
import { PolicyDirectory } from './policyDirectory.entity';

@Entity()
export class PolicyToPolicyDirectory {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @ManyToOne(() => Policy, (policy) => policy.policyToOrganizations)
  @Index() // Добавляем индекс для поля policy
  policy: Policy;

  @ManyToOne(
    () => PolicyDirectory,
    (policyDirectory) => policyDirectory.policyToPolicyDirectories,
  )
  policyDirectory: PolicyDirectory;
}
