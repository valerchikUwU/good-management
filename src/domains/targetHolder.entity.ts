import { Entity, PrimaryColumn, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Target } from './target.entity';


@Entity()
export class TargetHolder{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToOne(() => Target, target => target.targetHolder, {nullable: false})
    @JoinColumn()
    target: Target;

    @ManyToOne(() => User, (user) => user.targetHolders, {nullable: false})
    user: User
}