import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { TargetEntity } from './target';

@Entity()
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

  @Column()
  type: string;
}
