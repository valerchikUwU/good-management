import { Entity, PrimaryColumn, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn, OneToOne } from 'typeorm';
import { User } from './user.entity';
import { Organization } from './organization.entity';


@Entity()
export class Post {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({nullable: false})
    postName: string;

    @Column({nullable: true})
    divisionName: string;

    @OneToOne(() => User, user => user.post, {nullable: false})
    @JoinColumn()
    user: User;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
  
    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @ManyToOne(() => Organization, organization => organization.posts, {nullable: false})
    organization: Organization
}