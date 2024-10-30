import { Column, CreateDateColumn, Entity, Generated, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { GroupToUser } from "./groupToUser.entity";
import { Account } from "./account.entity";



@Entity()
export class Group{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ length: 50, nullable: false })
    groupName: string;

    @Column({ length: 50, nullable: true })
    groupDivisionName: string;

    @Column()
    @Generated('increment')
    groupNumber: number;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
  
    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @OneToMany(() => GroupToUser, (groupToUser) => groupToUser.group)
    groupToUsers: GroupToUser[]

    @ManyToOne(() => Account, (account) => account.groups, {nullable: false})
    account: Account
    
}