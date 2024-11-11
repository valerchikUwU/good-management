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

@Entity()
export class PolicyToOrganization {
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
    () => Organization,
    (organization) => organization.policyToOrganizations,
  )
  @Index() // Добавляем индекс для поля organization
  organization: Organization;
}
