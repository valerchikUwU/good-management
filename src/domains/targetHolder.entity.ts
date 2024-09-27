import { Entity, PrimaryColumn, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn, Index } from 'typeorm';
import { User } from './user.entity';
import { Target } from './target.entity';



@Entity()
@Index(['target', 'user'], { unique: true })
export class TargetHolder {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Target, target => target.targetHolders, { nullable: false })
    target: Target;

    @ManyToOne(() => User, (user) => user.targetHolders, { nullable: false })
    user: User;
}
