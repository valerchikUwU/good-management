import { CreateDateColumn, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Organization } from "./organization.entity";
import { Project } from "./project.entity";


@Entity()
export class ProjectToOrganization{
    @PrimaryGeneratedColumn('uuid')
    public id: string;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
  
    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @ManyToOne(() => Project, (project) => project.projectToOrganizations)
    project: Project

    @ManyToOne(() => Organization, (organization) => organization.projectToOrganizations)
    organization: Organization
}