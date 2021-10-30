import {Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {TimePiece} from './timePiece'
import {User} from "./user";
import {preventWildChild} from "./util";

@Entity()
export class Target {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ManyToOne(() => User, user => user.targets)
    @JoinColumn()
    user: User;

    @CreateDateColumn()
    created_at: Date;

    @Column()
    name: string;

    @Column()
    timeSpent: number;

    @OneToMany(() => TimePiece, timePiece => timePiece.target, preventWildChild)
    timePieces: TimePiece[]
}
