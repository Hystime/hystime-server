import { getConnection } from 'typeorm';
import { User } from '../entities/user';
import { MutationTargetInput, MutationTimePieceInput, MutationUserInput } from '../types/inputsType';
import { Target } from '../entities/target';
import { TimePiece } from '../entities/timePiece';
import { assert } from '../utils';

export class Db {
  public static async getUser(username: string): Promise<User | null> {
    if (username === undefined) {
      return null;
    }
    const userRepo = getConnection().getRepository(User);
    const userEntity = await userRepo.findOne({ username: username });
    if (!userEntity) {
      return null;
    }
    return userEntity;
  }

  public static async checkUser(username: string): Promise<undefined | User> {
    const userRepo = getConnection().getRepository(User);
    return await userRepo.findOne({ username: username });
  }

  public static async createUser(input: MutationUserInput): Promise<boolean> {
    if ((await this.checkUser(input.username)) !== undefined) {
      return false;
    }
    const user = new User();
    user.username = input.username;
    const targets: Target[] = [];
    for (const targetInput of targets) {
      targets.push(await this.addTarget(user, targetInput));
    }
    user.targets = targets;

    await getConnection().manager.save(user);
    return true;
  }

  public static async addTarget(user: string, input: MutationTargetInput): Promise<boolean>;
  public static async addTarget(user: User, input: MutationTargetInput): Promise<Target>;
  public static async addTarget(user: string | User, input: MutationTargetInput): Promise<boolean | Target> {
    const calledByMutation = typeof user === 'string';
    const userRepo = getConnection().getRepository(User);

    if (typeof user === 'string') {
      const ret = await userRepo.findOne({ username: user });
      if (ret === undefined) return false;
      user = ret;
    }

    assert<User>(user);

    const target = new Target();
    target.user = user;
    target.name = input.name;
    target.timeSpent = input.timeSpent || 0;
    target.timePieces = input.timePieces ? await this.addTimePieces(target, input.timePieces) : [];

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

  public static async addTimePiece(target: string, input: MutationTimePieceInput): Promise<boolean>;
  public static async addTimePiece(target: Target, input: MutationTimePieceInput): Promise<TimePiece>;
  public static async addTimePiece(target: string | Target, input: MutationTimePieceInput): Promise<boolean | TimePiece> {
    const calledByMutation = typeof target === 'string';
    const targetRepo = getConnection().getRepository(Target);

    if (typeof target === 'string') {
      const ret = await targetRepo.findOne({ id: target });
      if (ret === undefined) return false;
      target = ret;
    }

    assert<Target>(target);

    const timePiece = new TimePiece();
    timePiece.target = target;
    timePiece.start = input.start;
    timePiece.duration = input.duration;
    if (!['normal', 'pomodoro'].includes(input.type)) {
      throw new Error(`Unacceptable piece type ${input.type}`);
    }
    timePiece.type = input.type;

    if (calledByMutation) {
      if (target.timePieces === undefined) {
        target.timePieces = [];
      }
      target.timePieces.push(timePiece);
      await targetRepo.save(target);
      return true;
    }
    return timePiece;
  }

  public static async addTimePieces(target: string, inputs: MutationTimePieceInput[]): Promise<boolean>;
  public static async addTimePieces(target: Target, inputs: MutationTimePieceInput[]): Promise<TimePiece[]>;
  public static async addTimePieces(target: string | Target, inputs: MutationTimePieceInput[]): Promise<boolean | TimePiece[]> {
    const calledByMutation = typeof target === 'string';
    const timePieces: TimePiece[] = [];

    const targetRepo = getConnection().getRepository(Target);

    if (typeof target === 'string') {
      const ret = await targetRepo.findOne({ id: target });
      if (ret === undefined) return false;
      target = ret;
    }

    assert<Target>(target);

    for (const input of inputs) {
      timePieces.push(await this.addTimePiece(target, input));
    }

    if (calledByMutation) {
      if (target.timePieces === undefined) {
        target.timePieces = [];
      }
      target.timePieces.push(...timePieces);
      await targetRepo.save(target);
      return true;
    }

    return timePieces;
  }
}
