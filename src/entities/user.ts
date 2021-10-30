import { CreateDateColumn, Entity, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { Target } from './target';
import { preventWildChild } from './util';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @PrimaryColumn()
  username: string;

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => Target, (target) => target.user, preventWildChild)
  targets: Target[];
}
