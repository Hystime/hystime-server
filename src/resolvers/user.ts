import { UserResolvers } from '../generated/types';
import { Db } from '../db/db';

export const User: UserResolvers = {
  id: async (parent, args, context, info) => {
    return parent.id;
  },
  username: async (parent, args, context, info) => {
    return parent.username;
  },
  created_at: async (parent, args, context, info) => {
    return parent.created_at;
  },
  targets: async (parent, args, context, info) => {
    return parent.targets;
  },
  last_week_timePieces: async ({ id }, args, context, info) => {
    return Db.getUserLastWeekTimePieces(id);
  },
};
