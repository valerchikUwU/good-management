import { Entity, PrimaryColumn, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Target } from './target.entity';
import { ProjectToOrganization } from './projectToOrganization.entity';

export enum Type {
    PROJECT = 'Проект',
    PROGRAM = 'Программа'
}

@Entity()
export class Project{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({type: 'uuid', nullable: true})
    programId: string;

    @Column({type: 'text', nullable: false})
    content: string;

    @Column({
        type: 'enum',
        enum: Type,
        default: Type.PROJECT,
        nullable: false
    })
    type: Type;

    @OneToMany(() => ProjectToOrganization, (projectToOrganization) => projectToOrganization.project)
    projectToOrganizations: ProjectToOrganization[]

    @OneToMany(() => Target, (target) => target.project)
    targets: Target[]
}