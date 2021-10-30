import { getConnection } from 'typeorm';
import { User } from '../entities/user';
import { QueryUserArgsType } from '../types/argsType';
import { Db } from '../db/db';

export const queryResolvers = {
  Query: {
    user: async (parent: any, args: QueryUserArgsType, context: any, info: any) => {
      return await Db.getUser(args.username);
    },
  },
};
