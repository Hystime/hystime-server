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
import {
  createQueryBuilder,
  EntityTarget,
  getConnection,
  getManager,
  getRepository,
  UpdateResult,
} from 'typeorm';
import { TimePieceEntity } from '../entities/timePiece';
import { TargetEntity } from '../entities/target';
import { assertType } from '../utils';
import { OrderDirection, paginate } from '../utils/pagination';
import moment from 'moment';

export class Db {
  public static async getUser(username: string): Promise<User> {
    const user = await getManager().findOne(UserEntity, { username }, { relations: ['targets'] });
    if (!user) {
      throw Error('User not found.');
    }
    return DbUtils.eTGM.user(user);
  }

  public static async getTarget(target_id: string): Promise<Target> {
    const target = await getManager().findOne(TargetEntity, { id: target_id });
    if (!target) {
      throw Error('Target not found.');
    }
    return DbUtils.eTGM.target(target);
  }

  public static async createUser(input: UserCreateInput): Promise<User> {
    if ((await DbUtils.checkUser(input.username)) === undefined) {
      const userEntity = DbUtils.getUserEntity(input);
      await getManager().save(userEntity);
      return DbUtils.eTGM.user(userEntity);
    } else {
      throw Error('Duplicate user.');
    }
  }

  public static async updateUser(user_id: string, input: UserUpdateInput): Promise<User> {
    const userEntity = await DbUtils.checkEntityById(user_id, UserEntity);
    if (userEntity) {
      if (input.username) {
        userEntity.username = input.username;
      }
    } else {
      throw Error('User not found');
    }
    await getManager().save(userEntity);
    return DbUtils.eTGM.user(userEntity);
  }

  public static async createTarget(user_id: string, input: TargetCreateInput): Promise<Target> {
    const userEntity = await DbUtils.checkEntityById(user_id, UserEntity);
    if (userEntity) {
      if (await DbUtils.checkTarget(userEntity, input.name)) {
        throw Error('Duplicate target.');
      }
      const targetEntity = DbUtils.getTargetEntity(input);
      targetEntity.user = userEntity;
      await getManager().save(targetEntity);
      return DbUtils.eTGM.target(targetEntity);
    }
    throw Error('User not found.');
  }

  public static async updateTarget(target_id: string, input: TargetUpdateInput): Promise<Target> {
    const targetEntity = await DbUtils.checkEntityById(target_id, TargetEntity);
    if (targetEntity) {
      if (input.type) {
        targetEntity.type = input.type;
      }
      if (input.name) {
        targetEntity.name = input.name;
      }
      await getManager().save(targetEntity);
      return DbUtils.eTGM.target(targetEntity);
    } else {
      throw Error('Target not found.');
    }
  }

  public static async deleteTarget(target_id: string): Promise<boolean> {
    const targetEntity = await DbUtils.checkEntityById(target_id, TargetEntity);
    if (targetEntity) {
      await getManager().remove(targetEntity.timePieces);
      await getManager().remove(targetEntity); // FIXME: use a transaction to delete in one operation
      return true;
    }
    throw Error('Target not found.');
  }

  public static async createTimePiece(
    target_id: string,
    input: TimePieceCreateInput
  ): Promise<TimePiece> {
    const targetEntity = await DbUtils.checkEntityById(target_id, TargetEntity);
    if (targetEntity) {
      const timePieceEntity = DbUtils.getTimePieceEntity(input);
      timePieceEntity.target = targetEntity;
      await getManager().save(timePieceEntity);
      await DbUtils.updateTimeSpent(target_id, input.duration);
      return timePieceEntity;
    } else {
      throw Error('Target not found.');
    }
  }

  public static async updateTimePiece(
    timepiece_id: number,
    input: TimePieceUpdateInput
  ): Promise<TimePiece> {
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
      await getManager().save(timePieceEntity);
      if (input.duration - timePieceEntity.duration !== 0) {
        await DbUtils.updateTimeSpent(
          timePieceEntity.target.id,
          input.duration - timePieceEntity.duration
        );
      }
      return timePieceEntity;
    } else {
      throw Error('TimePiece not found.');
    }
  }

  public static async deleteTimePiece(timepiece_id: number): Promise<boolean> {
    const timePieceEntity = await DbUtils.checkEntityById(timepiece_id, TimePieceEntity);
    if (timePieceEntity) {
      await DbUtils.updateTimeSpent(timePieceEntity.target.id, -timePieceEntity.duration);
      await getManager().remove(timePieceEntity);
      return true;
    }
    throw Error('TimePiece not found');
  }

  public static async createTimePieces(
    target_id: string,
    input: TimePieceCreateInput[]
  ): Promise<TimePieceEntity[]> {
    const targetEntity = await DbUtils.checkEntityById(target_id, TargetEntity);
    if (targetEntity) {
      const timePieceEntities = input.map((timePiece) => DbUtils.getTimePieceEntity(timePiece));
      timePieceEntities.forEach((timePiece) => (timePiece.target = targetEntity));
      await getManager().save(timePieceEntities);
      await DbUtils.updateTimeSpent(
        target_id,
        timePieceEntities.map((timePiece) => timePiece.duration).reduce((a, b) => a + b, 0)
      );
      return timePieceEntities;
    } else {
      throw Error('Target not found');
    }
  }

  public static async getUserTimepieces(
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
        queryBuilder: getConnection()
          .getRepository(TimePieceEntity)
          .createQueryBuilder('timePieces')
          .innerJoinAndSelect('timePieces.targetId', 'target', 'target.userId = :userId', {
            userId: user_id,
          }),
      }
    );
  }

  public static async getTargetTimePieces(
    target_id: string,
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
        queryBuilder: getConnection()
          .getRepository(TimePieceEntity)
          .createQueryBuilder('timePieces')
          .where('timePieces.targetId = :targetId', { targetId: target_id }),
      }
    );
  }

  public static async getUserLastWeekTimePieces(user_id: string): Promise<TimePiece[]> {
    return getConnection()
      .getRepository(TimePieceEntity)
      .createQueryBuilder('timePiece')
      .innerJoinAndSelect('timePiece.target', 'target', 'target.user = :userId', {
        userId: user_id,
      })
      .where('timePiece.start >= :start', {
        start: moment().subtract(6, 'days').startOf('days').toDate(),
      })
      .getMany();
  }

  public static async getTargetLastWeekTimePieces(target_id: string): Promise<TimePiece[]> {
    return getConnection()
      .getRepository(TimePieceEntity)
      .createQueryBuilder('timePiece')
      .where('timePiece.target = :targetId', { targetId: target_id })
      .andWhere('timePiece.start >= :start', {
        start: moment().subtract(6, 'days').startOf('days').toDate(),
      })
      .orderBy('timePiece.start', 'DESC')
      .getMany();
  }

  public static async getUserPomodoroCount(id: string): Promise<number> {
    return createQueryBuilder(TimePieceEntity, 'timePiece')
      .innerJoinAndSelect('timePiece.target', 'target', 'target.user = :userId', {
        userId: id,
      })
      .where('timePiece.type = :type', { type: TimePieceType.Pomodoro })
      .getCount();
  }

  public static async getUserTodayPomodoroCount(id: string): Promise<number> {
    return createQueryBuilder(TimePieceEntity, 'timePiece')
      .innerJoinAndSelect('timePiece.target', 'target', 'target.user = :userId', {
        userId: id,
      })
      .where('timePiece.type = :type', { type: TimePieceType.Pomodoro })
      .andWhere('timePiece.start >= :start', {
        start: moment().startOf('days').toDate(),
      })
      .getCount();
  }

  public static async getUserTodayTimeSpent(id: string): Promise<number> {
    return (
      await getRepository(TimePieceEntity)
        .createQueryBuilder('timePiece')
        .innerJoinAndSelect('timePiece.target', 'target', 'target.user = :userId', {
          userId: id,
        })
        .where('timePiece.start >= :start', {
          start: moment().startOf('days').toDate(),
        })
        .getMany()
    ).reduce((pre, cur) => pre + cur.duration, 0);
  }

  public static async getTargetTodayTimeSpent(id: string): Promise<number> {
    return (
      await getRepository(TimePieceEntity)
        .createQueryBuilder('timePiece')
        .where('timePiece.targetId = :targetId', { targetId: id })
        .andWhere('timePiece.start >= :start', {
          start: moment().startOf('days').toDate(),
        })
        .getMany()
    ).reduce((pre, cur) => pre + cur.duration, 0);
  }

  public static async getTargetPomodoroCount(id: string): Promise<number> {
    return createQueryBuilder(TimePieceEntity, 'timePiece')
      .innerJoinAndSelect('timePiece.target', 'target', 'target.user = :userId', {
        userId: id,
      })
      .where('timePiece.type = :type', { type: TimePieceType.Pomodoro })
      .getCount();
  }

  public static async getTargetTodayPomodoroCount(id: string): Promise<number> {
    return createQueryBuilder(TimePieceEntity, 'timePiece')
      .innerJoinAndSelect('timePiece.target', 'target', 'target.user = :userId', {
        userId: id,
      })
      .where('timePiece.type = :type', { type: TimePieceType.Pomodoro })
      .andWhere('timePiece.start >= :start', {
        start: moment().startOf('days').toDate(),
      })
      .getCount();
  }
}

class DbUtils {
  // entity to graphql model
  static eTGM = class {
    public static user(entity: UserEntity): User {
      return {
        created_at: entity.created_at,
        id: entity.id,
        pomodoroCount: null,
        timeSpent: null,
        todayPomodoroCount: null,
        todayTimeSpent: null,
        targets:
          entity.targets === undefined
            ? null
            : entity.targets
                .map((value) => DbUtils.eTGM.target(value))
                .sort((a, b) => a.created_at.valueOf() - b.created_at.valueOf()),
        username: entity.username,
        lastWeekTimePieces: null,
        timePieces: null,
      };
    }

    public static target(entity: TargetEntity): Target {
      return {
        pomodoroCount: null,
        todayPomodoroCount: null,
        todayTimeSpent: null,
        created_at: entity.created_at,
        id: entity.id,
        name: entity.name,
        type: entity.type,
        timeSpent: entity.timeSpent,
        timePieces: null, // Works as trick, timePieces resolver will not use data from parent. TODO: make this more graceful
        lastWeekTimePieces: null,
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
    type: EntityTarget<T>
  ): Promise<T | undefined> {
    const repo = getConnection().getRepository(type);
    // @ts-ignore manually assume id exist
    return repo.findOne({ id });
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
