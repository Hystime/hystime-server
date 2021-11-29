import { Db } from '../db/db';
import { QueryResolvers, Target, TimePieceConnection, User } from '../generated/types';

export const Query: QueryResolvers = {
  test: async () => true,
  user: async (parent: any, { username }): Promise<User | null> => {
    return Db.getUser(username);
  },
  target: async (parent: any, { target_id }): Promise<Target | null> => {
    return Db.getTarget(target_id);
  },
  timepieces: async (parent: any, { user_id, first, after }): Promise<TimePieceConnection> => {
    return Db.getTimepieces(user_id, first, after);
  },
};
