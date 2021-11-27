import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TimePieceEntity } from './timePiece';
import { UserEntity } from './user';
import { preventWildChild } from './util';
import { TargetType } from '../generated/types';

@Entity({ name: 'target' })
export class TargetEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UserEntity, (user) => user.targets)
  @JoinColumn()
  user: UserEntity;

  @CreateDateColumn()
  created_at: Date;

  @Column()
  name: string;

  @Column()
  timeSpent: number;

  @Column('varchar', { length: 20 })
  type: TargetType;

  @OneToMany(() => TimePieceEntity, (timePiece) => timePiece.target, preventWildChild)
  timePieces: TimePieceEntity[];
}
