import { Entity, PrimaryColumn, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Policy } from './policy.entity';


@Entity()
export class File{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({nullable: false})
    fileName: string;

    @Column({nullable: false})
    path: string;

    @Column({nullable: false})
    size: number;

    @Column({nullable: false})
    mimetype: string;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
  
    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @ManyToOne(() => Policy, (policy) => policy.files)
    policy: Policy
}