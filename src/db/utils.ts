import { UserEntity } from '../entities/user';
import {
  Target,
  TargetCreateInput,
  TargetType,
  TimePiece,
  TimePieceCreateInput,
  TimePieceType,
  User,
  UserCreateInput,
  UserUpdateInput,
} from '../generated/types';
import { TargetEntity } from '../entities/target';
import { TimePieceEntity } from '../entities/timePiece';
import { EntityTarget, FindOneOptions, getConnection, getRepository, UpdateResult } from 'typeorm';
import { assertType } from '../utils';

export class DbUtils {
  // entity to graphql model
  static eTGM = class {
    public static user(entity: UserEntity): User {
      return {
        created_at: entity.created_at,
        id: entity.id,
        username: entity.username,
        targets:
          entity.targets === undefined
            ? null
            : entity.targets
                .map((value) => DbUtils.eTGM.target(value))
                .sort((a, b) => a.created_at.valueOf() - b.created_at.valueOf()),
        pomodoroCount: null,
        timeSpent: null,
        todayPomodoroCount: null,
        todayTimeSpent: null,
        target: null,
        lastWeekTimePieces: null,
        timePieces: null,
      };
    }

    public static target(entity: TargetEntity): Target {
      return {
        created_at: entity.created_at,
        id: entity.id,
        name: entity.name,
        type: entity.type,
        timeSpent: entity.timeSpent,
        timePieces: null, // Works as trick, timePieces resolver will not use data from parent. TODO: make this more graceful
        lastWeekTimePieces: null,
        pomodoroCount: null,
        todayPomodoroCount: null,
        todayTimeSpent: null,
      };
    }

    public static timePiece(entity: TimePieceEntity): TimePiece {
      return {
        id: entity.id,
        start: entity.start,
        duration: entity.duration,
        type: entity.type,
        target: entity.target === undefined ? null : DbUtils.eTGM.target(entity.target),
      };
    }
  };

  // Username can not be duplicate
  public static async checkUser(username: string): Promise<undefined | UserEntity> {
    const userRepo = getRepository(UserEntity);
    return userRepo.findOne({ username: username });
  }

  public static async checkTarget(
    user: UserEntity,
    name: string
  ): Promise<undefined | TargetEntity> {
    const targetRepo = getConnection().getRepository(TargetEntity);
    return targetRepo.findOne({ name: name, user });
  }

  public static async checkEntityById<T>(
    id: string | number,
    type: EntityTarget<T>,
    options: FindOneOptions<T> = {}
  ): Promise<T | undefined> {
    const repo = getConnection().getRepository(type);
    // @ts-ignore manually assume id exist
    return repo.findOne({ id }, options);
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
      targetEntity.timeSpent += input.timePieces
        .map((timePieceInput) => timePieceInput.duration)
        .reduce((a, b) => a + b, 0);
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
    timePieceEntity.type = input.type || TimePieceType.Normal;
    return timePieceEntity;
  }

  public static updateTimeSpent(target_id: string, timeChange: number): Promise<UpdateResult> {
    const repo = getRepository(TargetEntity);
    if (timeChange > 0) {
      return repo.increment({ id: target_id }, 'timeSpent', timeChange);
    } else {
      return repo.decrement({ id: target_id }, 'timeSpent', -timeChange);
    }
  }
}
