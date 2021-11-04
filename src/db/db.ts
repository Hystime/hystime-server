import {
  Target,
  TargetCreateInput, TargetType,
  TargetUpdateInput,
  TimePiece,
  TimePieceCreateInput, TimepieceType,
  TimePieceUpdateInput,
  User,
  UserCreateInput,
  UserUpdateInput
} from "../generated/types";
import { UserEntity } from '../entities/user';
import { EntityTarget, getConnection } from 'typeorm';
import { TimePieceEntity } from '../entities/timePiece';
import { TargetEntity } from '../entities/target';
import { assertType } from '../utils';

export class Db {
  public static async getUser(username: string): Promise<User | null> {
    const user = await getConnection().manager.findOne(UserEntity, { username });
    return user ? user : null;
  }

  public static async getTarget(target_id: string): Promise<Target | null> {
    const target = await getConnection().manager.findOne(TargetEntity, { id: target_id });
    return target ? target : null;
  }

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
    const userEntity = await DbUtils.checkEntityById(user_id, UserEntity);
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

  public static async createTarget(user_id: string, input: TargetCreateInput): Promise<Target | null> {
    const userEntity = await DbUtils.checkEntityById(user_id, UserEntity);
    if (userEntity) {
      const targetEntity = DbUtils.getTargetEntity(input);
      await getConnection().manager.save(targetEntity);
      return targetEntity;
    } else {
      return null;
    }
  }

  public static async updateTarget(target_id: string, input: TargetUpdateInput): Promise<Target | null> {
    const targetEntity = await DbUtils.checkEntityById(target_id, TargetEntity);
    if (targetEntity) {
      if (input.type) {
        targetEntity.type = input.type;
      }
      if (input.name) {
        targetEntity.name = input.name;
      }
      await getConnection().manager.save(targetEntity);
      return targetEntity;
    } else {
      return null;
    }
  }

  public static async deleteTarget(target_id: string): Promise<boolean> {
    const targetEntity = await DbUtils.checkEntityById(target_id, TargetEntity);
    if (targetEntity) {
      await getConnection().manager.remove(targetEntity); // FIXME: delete correspond timepiece.
      return true;
    }
    return false;
  }

  public static async createTimePiece(target_id: string, input: TimePieceCreateInput): Promise<TimePiece | null> {
    const targetEntity = await DbUtils.checkEntityById(target_id, TargetEntity);
    if (targetEntity) {
      const timePieceEntity = DbUtils.getTimePieceEntity(input);
      timePieceEntity.target = targetEntity;
      await getConnection().manager.save(timePieceEntity);
      return timePieceEntity;
    } else {
      return null;
    }
  }

  public static async updateTimePiece(timepiece_id: number, input: TimePieceUpdateInput): Promise<TimePiece | null> {
    const timePieceEntity = await DbUtils.checkEntityById(timepiece_id, TimePieceEntity);
    if (timePieceEntity) {
      if (input.start) {
        timePieceEntity.start = input.start;
      }
      if (input.duration) {
        timePieceEntity.duration = input.duration;
      }
      if (input.type) {
        timePieceEntity.type = input.type;
      }
      await getConnection().manager.save(timePieceEntity);
      return timePieceEntity;
    } else {
      return null;
    }
  }

  public static async deleteTimePiece(timepiece_id: number): Promise<boolean> {
    const timePieceEntity = await DbUtils.checkEntityById(timepiece_id, TimePieceEntity);
    if (timePieceEntity) {
      await getConnection().manager.remove(timePieceEntity);
      return true;
    }
    return false;
  }

  public static async createTimePieces(target_id: string, input: TimePieceCreateInput[]): Promise<TimePieceEntity[] | null> {
    const targetEntity = await DbUtils.checkEntityById(target_id, TargetEntity);
    if (targetEntity) {
      const timePieceEntities = input.map((timePiece) => DbUtils.getTimePieceEntity(timePiece));
      timePieceEntities.forEach((timePiece) => (timePiece.target = targetEntity));
      await getConnection().manager.save(timePieceEntities);
      return timePieceEntities;
    } else {
      return null;
    }
  }
}

class DbUtils {
  // User can not be duplicate
  public static async checkUser(username: string): Promise<undefined | UserEntity> {
    const userRepo = getConnection().getRepository(UserEntity);
    return await userRepo.findOne({ username: username });
  }

  public static async checkEntityById<T>(id: string | number, type: EntityTarget<T>): Promise<T | undefined> {
    const repo = getConnection().getRepository(type);
    // @ts-ignore
    return await repo.findOne({ id: id });
  }

  // Believe input is always valid.
  public static getUserEntity(input: UserCreateInput | UserUpdateInput): UserEntity {
    const userEntity = new UserEntity();

    if (input.username) {
      userEntity.username = input.username;
    }
    assertType<UserCreateInput>(input);

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
    targetEntity.type = input.type || TargetType.Normal;
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
    timePieceEntity.type = input.type || TimepieceType.Normal;
    return timePieceEntity;
  }
}
