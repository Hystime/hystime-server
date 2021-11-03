import { Column, CreateDateColumn, Entity, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { TargetEntity } from './target';
import { preventWildChild } from './util';

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  username: string;

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => TargetEntity, (target) => target.user, preventWildChild)
  targets: TargetEntity[];
}
