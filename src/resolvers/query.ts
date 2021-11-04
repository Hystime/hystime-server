import { Db } from '../db/db';
import { QueryResolvers, Target, User } from '../generated/types';

export const Query: QueryResolvers = {
  user: async (parent: any, { username }, context, info: any): Promise<User | null> => {
    return await Db.getUser(username);
  },
  target: async (parent: any, { target_id }, context, info): Promise<Target | null> => {
    return await Db.getTarget(target_id);
  },
};
