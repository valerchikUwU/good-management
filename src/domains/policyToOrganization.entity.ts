import { CreateDateColumn, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Objective } from "./objective.entity";
import { Organization } from "./organization.entity";
import { Policy } from "./policy.entity";


@Entity()
export class PolicyToOrganization{
    @PrimaryGeneratedColumn('uuid')
    public id: string;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
  
    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @ManyToOne(() => Policy, (policy) => policy.policyToOrganizations)
    policy: Policy

    @ManyToOne(() => Organization, (organization) => organization.policyToOrganizations)
    organization: Organization
}