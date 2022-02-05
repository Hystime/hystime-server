import { TargetResolvers } from '../generated/types';
import { Db } from '../db/db';

export const Target: TargetResolvers = {
  id: async (parent) => {
    return parent.id;
  },
  type: async (parent) => {
    return parent.type;
  },
  created_at: async (parent) => {
    return parent.created_at;
  },
  name: async (parent) => {
    return parent.name;
  },
  timeSpent: async (parent) => {
    return parent.timeSpent;
  },
  todayTimeSpent: async ({ id }) => {
    return Db.getTargetTodayTimeSpent(id);
  },
  timePieces: async ({ id }, { first, after }) => {
    return Db.getTargetTimePieces(id, first, after);
  },
  lastWeekTimePieces: async ({ id }) => {
    return Db.getTargetLastWeekTimePieces(id);
  },
  pomodoroCount: async ({ id }) => {
    return Db.getTargetPomodoroCount(id);
  },
  todayPomodoroCount: async ({ id }) => {
    return Db.getTargetTodayPomodoroCount(id);
  },
};
