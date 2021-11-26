import { Db } from '../db/db';
import { QueryResolvers, Target, TimePieceConnection, User } from '../generated/types';

export const Query: QueryResolvers = {
  user: async (parent: any, { username }, context, info: any): Promise<User | null> => {
    return Db.getUser(username);
  },
  target: async (parent: any, { target_id }, context, info): Promise<Target | null> => {
    return Db.getTarget(target_id);
  },
  timepieces: async (parent: any, { user_id, first, after }, context, info): Promise<TimePieceConnection> => {
    return Db.getTimepieces(user_id, first, after);
  },
};
