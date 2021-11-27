import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TargetEntity } from './target';
import { TimePieceType } from '../generated/types';

@Entity({ name: 'time_piece' })
export class TimePieceEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => TargetEntity, (target) => target.timePieces)
  @JoinColumn()
  target: TargetEntity;

  @PrimaryColumn()
  start: Date;

  @Column()
  duration: number;

  @Column('varchar', { length: 20 })
  type: TimePieceType;
}
