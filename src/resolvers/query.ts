import { Db } from '../db/db';
import { QueryResolvers, Target, User } from '../generated/types';

export const Query: QueryResolvers = {
  test: async () => true,
  user: async (parent: any, { username }): Promise<User | null> => {
    return Db.getUser(username);
  },
  target: async (parent: any, { target_id }): Promise<Target | null> => {
    return Db.getTarget(target_id);
  },
};
