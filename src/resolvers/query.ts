import { Db } from '../db/db';
import { QueryResolvers, User } from '../generated/types';

export const Query: QueryResolvers = {
  user: async (parent: any, args, context, info: any): Promise<User | null> => {
    const { username } = args;
    return await Db.getUser(username);
  },
};
