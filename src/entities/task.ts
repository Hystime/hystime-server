import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TargetEntity } from './target';
import { TimePieceType } from '../generated/types';
import { TaskTagEntity } from './taskTag';

@Entity({ name: 'task' })
export class TaskEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => TargetEntity, (target) => target.timePieces)
  @JoinColumn()
  target: TargetEntity;

  @Column()
  name: string;

  @OneToMany(() => TaskTagEntity, (taskTag) => taskTag.task)
  @JoinColumn()
  tag: TaskTagEntity;

  @Column('varchar', { length: 20 })
  type: TimePieceType;

  @CreateDateColumn()
  createdAt: Date;
}
