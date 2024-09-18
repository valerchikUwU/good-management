import { CreateDateColumn, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Goal } from "./goal.entity";
import { Organization } from "./organization.entity";
import { Exclude } from "class-transformer";


@Entity()
export class GoalToOrganization{
    @PrimaryGeneratedColumn('uuid')
    public id: string;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
  
    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @ManyToOne(() => Goal, (goal) => goal.goalToOrganizations)
    goal: Goal

    @ManyToOne(() => Organization, (organization) => organization.goalToOrganizations)
    @Exclude({toPlainOnly: true})
    organization: Organization
}