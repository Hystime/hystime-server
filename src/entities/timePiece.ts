import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { Target } from './target';

type PieceType = 'normal' | 'pomodoro';

@Entity()
export class TimePiece {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Target, (target) => target.timePieces)
  @JoinColumn()
  target: Target;

  @PrimaryColumn()
  start: Date;

  @Column()
  duration: number;

  @Column('text')
  type: PieceType;
}
