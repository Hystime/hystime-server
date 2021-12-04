import { UserResolvers } from '../generated/types';
import { Db } from '../db/db';

export const User: UserResolvers = {
  id: async (parent) => {
    return parent.id;
  },
  username: async (parent) => {
    return parent.username;
  },
  created_at: async (parent) => {
    return parent.created_at;
  },
  targets: async (parent) => {
    return parent.targets;
  },
  last_week_timePieces: async ({ id }) => {
    return Db.getUserLastWeekTimePieces(id);
  },
};
