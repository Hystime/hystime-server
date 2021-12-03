import {
  Target,
  TargetCreateInput,
  TargetType,
  TargetUpdateInput,
  TimePiece,
  TimePieceConnection,
  TimePieceCreateInput,
  TimePieceType,
  TimePieceUpdateInput,
  User,
  UserCreateInput,
  UserUpdateInput,
} from '../generated/types';
import { UserEntity } from '../entities/user';
import { EntityTarget, getConnection, UpdateResult } from 'typeorm';
import { TimePieceEntity } from '../entities/timePiece';
import { TargetEntity } from '../entities/target';
import { assertType } from '../utils';
import { OrderDirection, paginate } from '../utils/pagination';

// FIXME： Entity type to GraphQL Type
export class Db {
  public static async getUser(username: string): Promise<User | null> {
    const user = await getConnection().manager.findOne(
      UserEntity,
      { username },
      { relations: ['targets'] }
    );
    return user ? DbUtils.eTGM.user(user) : null;
  }

  public static async getTarget(target_id: string): Promise<Target | null> {
    const target = await getConnection().manager.findOne(TargetEntity, { id: target_id });
    return target ? DbUtils.eTGM.target(target) : null;
  }

  public static async createUser(input: UserCreateInput): Promise<User | null> {
    if ((await DbUtils.checkUser(input.username)) === undefined) {
      const userEntity = DbUtils.getUserEntity(input);
      await getConnection().manager.save(userEntity);
      return DbUtils.eTGM.user(userEntity);
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
    return DbUtils.eTGM.user(userEntity);
  }

  public static async createTarget(
    user_id: string,
    input: TargetCreateInput
  ): Promise<Target | null> {
    const userEntity = await DbUtils.checkEntityById(user_id, UserEntity);
    if (userEntity) {
      if (await DbUtils.checkTarget(userEntity, input.name)) {
        return null;
      }
      const targetEntity = DbUtils.getTargetEntity(input);
      targetEntity.user = userEntity;
      await getConnection().manager.save(targetEntity);
      return DbUtils.eTGM.target(targetEntity);
    }
    return null;
  }

  public static async updateTarget(
    target_id: string,
    input: TargetUpdateInput
  ): Promise<Target | null> {
    const targetEntity = await DbUtils.checkEntityById(target_id, TargetEntity);
    if (targetEntity) {
      if (input.type) {
        targetEntity.type = input.type;
      }
      if (input.name) {
        targetEntity.name = input.name;
      }
      await getConnection().manager.save(targetEntity);
      return DbUtils.eTGM.target(targetEntity);
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

  public static async createTimePiece(
    target_id: string,
    input: TimePieceCreateInput
  ): Promise<TimePiece | null> {
    const targetEntity = await DbUtils.checkEntityById(target_id, TargetEntity);
    if (targetEntity) {
      const timePieceEntity = DbUtils.getTimePieceEntity(input);
      timePieceEntity.target = targetEntity;
      await getConnection().manager.save(timePieceEntity);
      await DbUtils.updateTimeSpent(target_id, input.duration);
      return timePieceEntity;
    } else {
      return null;
    }
  }

  public static async updateTimePiece(
    timepiece_id: number,
    input: TimePieceUpdateInput
  ): Promise<TimePiece | null> {
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
      if (input.duration - timePieceEntity.duration !== 0) {
        await DbUtils.updateTimeSpent(
          timePieceEntity.target.id,
          input.duration - timePieceEntity.duration
        );
      }
      return timePieceEntity;
    } else {
      return null;
    }
  }

  public static async deleteTimePiece(timepiece_id: number): Promise<boolean> {
    const timePieceEntity = await DbUtils.checkEntityById(timepiece_id, TimePieceEntity);
    if (timePieceEntity) {
      await DbUtils.updateTimeSpent(timePieceEntity.target.id, -timePieceEntity.duration);
      await getConnection().manager.remove(timePieceEntity);
      return true;
    }
    return false;
  }

  public static async createTimePieces(
    target_id: string,
    input: TimePieceCreateInput[]
  ): Promise<TimePieceEntity[] | null> {
    const targetEntity = await DbUtils.checkEntityById(target_id, TargetEntity);
    if (targetEntity) {
      const timePieceEntities = input.map((timePiece) => DbUtils.getTimePieceEntity(timePiece));
      timePieceEntities.forEach((timePiece) => (timePiece.target = targetEntity));
      await getConnection().manager.save(timePieceEntities);
      await DbUtils.updateTimeSpent(
        target_id,
        timePieceEntities.map((timePiece) => timePiece.duration).reduce((a, b) => a + b, 0)
      );
      return timePieceEntities;
    } else {
      return null;
    }
  }

  public static async getTimepieces(
    user_id: string,
    first: number,
    after: string | null | undefined
  ): Promise<TimePieceConnection> {
    return paginate(
      {
        first,
        after,
        orderBy: {
          direction: OrderDirection.DESC,
          field: 'start',
        },
      },
      {
        type: 'TimePieceEntity',
        alias: 'timePieces',
        validateCursor: true,
        orderFieldToKey: (field) => field,
        queryBuilder: getConnection()
          .getRepository(TimePieceEntity)
          .createQueryBuilder('timePieces')
          .innerJoinAndSelect('timePieces.targetId', 'target', 'target.userId = :userId', {
            userId: user_id,
          }),
      }
    );
  }

  public static async getUserLastWeekTimePieces(user_id: string): Promise<TimePiece[]> {
    return getConnection()
      .getRepository(TimePieceEntity)
      .createQueryBuilder('timePiece')
      .innerJoinAndSelect('timePieces.targetId', 'target', 'target.userId = :userId', {
        userId: user_id,
      })
      .where('timePiece.start > :start', {
        start: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000),
      })
      .getMany();
  }

  public static async getTargetLastWeekTimePieces(target_id: string): Promise<TimePiece[]> {
    return getConnection()
      .getRepository(TimePieceEntity)
      .createQueryBuilder('timePieces')
      .where('timePieces.targetId = :targetId', { targetId: target_id })
      .andWhere('timePieces.start >= :start', {
        start: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000),
      })
      .orderBy('timePieces.start', 'DESC')
      .getMany();
  }
}

class DbUtils {
  // entity to graphql model
  static eTGM = class {
    public static user(entity: UserEntity): User {
      return {
        created_at: entity.created_at,
        id: entity.id,
        targets:
          entity.targets === undefined
            ? null
            : entity.targets
                .map((value) => DbUtils.eTGM.target(value))
                .sort((a, b) => a.created_at.valueOf() - b.created_at.valueOf()),
        username: entity.username,
        last_week_timePieces: null,
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
        last_week_timePieces: null,
      };
    }
  };

  // Username can not be duplicate
  public static async checkUser(username: string): Promise<undefined | UserEntity> {
    const userRepo = getConnection().getRepository(UserEntity);
    return await userRepo.findOne({ username: username });
  }

  public static async checkTarget(
    user: UserEntity,
    name: string
  ): Promise<undefined | TargetEntity> {
    const targetRepo = getConnection().getRepository(TargetEntity);
    return await targetRepo.findOne({ name: name, user });
  }

  public static async checkEntityById<T>(
    id: string | number,
    type: EntityTarget<T>
  ): Promise<T | undefined> {
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
    const repo = getConnection().getRepository(TargetEntity);
    if (timeChange > 0) {
      return repo.increment({ id: target_id }, 'timeSpent', timeChange);
    } else {
      return repo.decrement({ id: target_id }, 'timeSpent', -timeChange);
    }
  }
}
