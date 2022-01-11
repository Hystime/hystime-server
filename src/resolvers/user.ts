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
  target: async ({ id: userID }, { id: targetID }) => {
    return Db.getTarget(userID, targetID);
  },
  targets: async (parent) => {
    return parent.targets;
  },
  lastWeekTimePieces: async ({ id }) => {
    return Db.getUserLastWeekTimePieces(id);
  },
  pomodoroCount: async ({ id }) => {
    return Db.getUserPomodoroCount(id);
  },
  timeSpent: async (parent) => {
    return parent.targets.reduce((pre, cur) => pre + cur.timeSpent, 0);
  },
  todayPomodoroCount: async ({ id }) => {
    return Db.getUserTodayPomodoroCount(id);
  },
  todayTimeSpent: async ({ id }) => {
    return Db.getUserTodayTimeSpent(id);
  },
  timePieces: async ({ id }, { first, after }) => {
    return Db.getUserTimepieces(id, first, after);
  },
};
