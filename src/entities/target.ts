import {Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {TimePiece} from './timePiece'

@Entity()
export class Target {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    user: string;

    @CreateDateColumn()
    created_at: Date;

    @Column()
    name: string;

    @Column()
    timeSpent: number;

    @OneToMany(() => TimePiece, timePiece => timePiece.target)
    timePieces: TimePiece[]
}
