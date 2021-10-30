import { Connection, getConnection } from 'typeorm';
import { User } from '../entities/user';
import { UserInput } from '../types/inputsType';

export class Db {
  public static async getUser(username: string) {
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

  public static async createUser(input: UserInput) {
    const userRepo = getConnection().getRepository(User);
    const userEntity = await userRepo.findOne({ username: input.username });
  }
}
