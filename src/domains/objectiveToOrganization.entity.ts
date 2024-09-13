import { CreateDateColumn, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Objective } from "./objective.entity";
import { Organization } from "./organization.entity";


@Entity()
export class ObjectiveToOrganization{
    @PrimaryGeneratedColumn('uuid')
    public id: string;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
  
    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @ManyToOne(() => Objective, (objective) => objective.objectiveToOrganizations)
    objective: Objective

    @ManyToOne(() => Organization, (organization) => organization.objectiveToOrganizations)
    organization: Organization
}