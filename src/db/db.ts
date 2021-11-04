import { TargetCreateInput, TargetUpdateInput, TimePieceCreateInput, User, UserCreateInput, UserUpdateInput } from '../generated/types';
import { UserEntity } from '../entities/user';
import { getConnection } from 'typeorm';
import { TimePieceEntity } from '../entities/timePiece';
import { TargetEntity } from '../entities/target';
import { assert } from '../utils';

export class Db {
  public static async createUser(input: UserCreateInput): Promise<User | null> {
    if ((await DbUtils.checkUser(input.username)) === undefined) {
      const userEntity = DbUtils.getUserEntity(input);
      await getConnection().manager.save(userEntity);
      return userEntity;
    } else {
      return null;
    }
  }

  public static async updateUser(user_id: string, input: UserUpdateInput): Promise<User | null> {
    const userEntity = await DbUtils.checkUserById(user_id);
    if (userEntity) {
      if (input.username) {
        userEntity.username = input.username;
      }
    } else {
      return null;
    }
    await getConnection().manager.save(userEntity);
    return userEntity;
  }

  public static async createTarget(input: TargetCreateInput): Promise<TargetEntity | null> {
    const userEntity = await DbUtils.checkUserById(input.user_id);
    if (userEntity) {
      const targetEntity = DbUtils.getTargetEntity(input);
      await getConnection().manager.save(targetEntity);
      return targetEntity;
    } else {
      return null;
    }
  }

  public static async updateTarget(target_id: string, input: TargetUpdateInput): Promise<TargetEntity | null> {
  }
}

class DbUtils {
  public static async checkUser(username: string): Promise<undefined | UserEntity> {
    const userRepo = getConnection().getRepository(UserEntity);
    return await userRepo.findOne({ username: username });
  }

  public static async checkUserById(id: string): Promise<undefined | UserEntity> {
    const userRepo = getConnection().getRepository(UserEntity);
    return await userRepo.findOne({ id: id });
  }

  // Believe input is always valid.
  public static getUserEntity(input: UserCreateInput | UserUpdateInput): UserEntity {
    const userEntity = new UserEntity();

    if (input.username) {
      userEntity.username = input.username;
    }
    assert<UserCreateInput>(input);

    if (input.targets) {
      userEntity.targets = input.targets.map((targetInput) => {
        const entity = this.getTargetEntity(targetInput);
        entity.user = userEntity; // Remember to add binding.
        return entity;
      });
    }
    return userEntity;
  }

  // Get target without user binding.
  public static getTargetEntity(input: TargetCreateInput): TargetEntity {
    const targetEntity = new TargetEntity();
    targetEntity.name = input.name;
    targetEntity.timeSpent = input.timeSpent || 0;
    if (input.timePieces) {
      targetEntity.timePieces = input.timePieces.map((timePieceInput) => {
        const entity = this.getTimePieceEntity(timePieceInput);
        entity.target = targetEntity;
        return entity;
      });
    }
    return targetEntity;
  }

  // Get timepiece without target binding.
  public static getTimePieceEntity(input: TimePieceCreateInput): TimePieceEntity {
    const timePieceEntity = new TimePieceEntity();
    timePieceEntity.start = input.start;
    timePieceEntity.duration = input.duration;
    timePieceEntity.type = input.type || 'normal';
    return timePieceEntity;
  }
}
