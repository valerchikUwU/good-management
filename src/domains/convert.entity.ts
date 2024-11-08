import { Entity, PrimaryColumn, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn, Index } from 'typeorm';
import { Account } from './account.entity';
import { User } from './user.entity';
import { Message } from './message.entity';
import { ConvertToUser } from './convertToUser.entity';



export enum TypeConvert {
    DIRECT = 'Прямой',
    ORDER = 'Приказ',
    COORDINATION = 'Согласование'
}
@Entity()
export class Convert{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({nullable: false})
    convertTheme: string;

    @Column({nullable: false})
    expirationTime: string;

    @Column({type: 'uuid', array: true, nullable: true})
    pathOfPosts: string[];

    @Column({
        type: 'enum',
        enum: TypeConvert,
        nullable: true
    })
    convertType: TypeConvert;

    @Column({type: 'uuid', nullable: true})
    activeUserId: string;


    @Column({type: 'timestamp', nullable: true})
    dateFinish: Date

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
  
    @OneToMany(()=> Message, (message) => message.convert)
    messages: Message[];

    @OneToMany(() => ConvertToUser, (convertToUser) => convertToUser.convert)
    convertToUsers: ConvertToUser[]

    @ManyToOne(() => User, (user) => user.convert, {nullable: false})
    host: User;

    @ManyToOne(() => Account, (account) => account.converts, {nullable: false})
    account: Account;
}