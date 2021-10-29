import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Target} from "./target";

type PieceType = "normal" | "pomodoro"

@Entity()
export class TimePiece {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(()=>Target,target=>target.timePieces)
    target: Target;

    @Column()
    start: Date;

    @Column()
    duration: number;

    @Column("text")
    type: PieceType;
}
