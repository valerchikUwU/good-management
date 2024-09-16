import { CreateDateColumn, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Organization } from "./organization.entity";
import { Strategy } from "./strategy.entity";


@Entity()
export class StrategyToOrganization{
    @PrimaryGeneratedColumn('uuid')
    public id: string;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
  
    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @ManyToOne(() => Strategy, (strategy) => strategy.strategyToOrganizations)
    strategy: Strategy

    @ManyToOne(() => Organization, (organization) => organization.strategyToOrganizations)
    organization: Organization
}