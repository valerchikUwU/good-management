import { Entity, PrimaryColumn, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn, OneToOne } from 'typeorm';
import { Organization } from './organization.entity';
import { User } from './user.entity';


@Entity()
export class Account {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({nullable: false})
    accountName: string;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
  
    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @OneToMany(() => User, (user) => user.account)
    user: User;

    @OneToMany(() => Organization, (organization) => organization.account)
    organizations: Organization[];

}