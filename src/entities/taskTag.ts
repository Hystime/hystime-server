import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TaskEntity } from './task';

@Entity({ name: 'task_tag' })
export class TaskTagEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => TaskEntity, (task) => task.tag)
  @JoinColumn()
  task: TaskEntity;

  @Column()
  name: string;

  @CreateDateColumn()
  createdAt: Date;
}
