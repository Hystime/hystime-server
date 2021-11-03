import { getConnection } from 'typeorm';
import { UserEntity } from '../entities/user';
import { TargetEntity } from '../entities/target';
import { TimePieceEntity } from '../entities/timePiece';
import { assert, assertNonNull } from '../utils';
import { Target, TargetCreateInput, TimePiece, TimePieceCreateInput, UserCreateInput } from '../generated/types';

export class Db {
  public static async getUser(username: string): Promise<UserEntity | null> {
    if (username === undefined) {
      return null;
    }
    const userRepo = getConnection().getRepository(UserEntity);
    const userEntity = await userRepo.findOne({ username: username });
    if (!userEntity) {
      return null;
    }
    return userEntity;
  }

  public static async checkUser(username: string): Promise<undefined | UserEntity> {
    const userRepo = getConnection().getRepository(UserEntity);
    return await userRepo.findOne({ username: username });
  }

  public static async createUser(input: UserCreateInput): Promise<UserEntity | null> {
    if ((await this.checkUser(input.username)) !== undefined) {
      return null;
    }
    const user = new UserEntity();
    user.username = input.username;
    const targets: TargetEntity[] = [];
    if (input.targets !== null) {
      for (const targetInput of input.targets) {
        const target = await this.createTarget(user, targetInput);
        if (target !== null) targets.push(target);
      }
      user.targets = targets;
    }

    await getConnection().manager.save(user);
    return user;
  }

  public static async createTarget(user: string, input: TargetCreateInput): Promise<boolean>;
  public static async createTarget(user: UserEntity, input: TargetCreateInput): Promise<TargetEntity | null>;
  public static async createTarget(user: string | UserEntity, input: TargetCreateInput): Promise<boolean | Target | null> {
    const calledByMutation = typeof user === 'string';
    const userRepo = getConnection().getRepository(UserEntity);

    if (typeof user === 'string') {
      const ret = await userRepo.findOne({ username: user });
      if (ret === undefined) return calledByMutation ? false : null;
      user = ret;
    }

    assert<UserEntity>(user);

    const target = new TargetEntity();
    target.user = user;
    target.name = input.name;
    target.timeSpent = input.timeSpent || 0;
    if (input.timePieces !== null) {
      target.timePieces = await this.createTimePieces(target, input.timePieces);
    }

    if (calledByMutation) {
      if (user.targets === undefined) {
        user.targets = [];
      }
      user.targets.push(target);
      await userRepo.save(user);
      return true;
    }
    return target;
  }

  public static async createTimePiece(target: string, input: TimePieceCreateInput): Promise<boolean>;
  public static async createTimePiece(target: TargetEntity, input: TimePieceCreateInput): Promise<TimePieceEntity | null>;
  public static async createTimePiece(target: string | TargetEntity, input: TimePieceCreateInput): Promise<boolean | TimePiece | null> {
    assertNonNull(input.start);
    assertNonNull(input.duration);

    const calledByMutation = typeof target === 'string';
    const targetRepo = getConnection().getRepository(TargetEntity);

    if (typeof target === 'string') {
      const ret = await targetRepo.findOne({ id: target });
      if (ret === undefined) return calledByMutation ? false : null;
      target = ret;
    }

    assert<TargetEntity>(target);

    const timePieceRepo = getConnection().getRepository(TimePieceEntity);
    const ret = await timePieceRepo.findOne({ start: input.start });
    if (ret !== undefined) return calledByMutation ? false : null;

    const timePiece = new TimePieceEntity();
    timePiece.target = target;
    timePiece.start = input.start;
    timePiece.duration = input.duration;
    if (input.type !== null) {
      if (!['normal', 'pomodoro'].includes(input.type)) {
        throw new Error(`Unacceptable piece type ${input.type}`);
      }
      timePiece.type = input.type;
    } else {
      timePiece.type = 'normal';
    }

    if (calledByMutation) {
      await timePieceRepo.save(timePiece);
      return true;
    }
    return timePiece;
  }

  public static async createTimePieces(target: string, inputs: TimePieceCreateInput[]): Promise<boolean>;
  public static async createTimePieces(target: TargetEntity, inputs: TimePieceCreateInput[]): Promise<TimePieceEntity[]>;
  public static async createTimePieces(
    target: string | TargetEntity,
    inputs: TimePieceCreateInput[]
  ): Promise<boolean | TimePieceEntity[]> {
    const calledByMutation = typeof target === 'string';
    const timePieces: TimePieceEntity[] = [];

    const targetRepo = getConnection().getRepository(TargetEntity);
    const timePieceRepo = getConnection().getRepository(TimePieceEntity);

    if (typeof target === 'string') {
      const ret = await targetRepo.findOne({ id: target });
      if (ret === undefined) return false;
      target = ret;
    }

    assert<TargetEntity>(target);

    for (const input of inputs) {
      const timePiece = await this.createTimePiece(target, input);
      if (timePiece !== null) timePieces.push(timePiece);
    }

    if (calledByMutation) {
      await timePieceRepo.save(timePieces);
      return timePieces.length === inputs.length;
    }

    return timePieces;
  }
}
