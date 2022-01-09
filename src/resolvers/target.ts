import { TargetResolvers, TimePieceResolvers } from '../generated/types';
import { OrderDirection, paginate } from '../utils/pagination';
import { TimePieceEntity } from '../entities/timePiece';
import { getConnection } from 'typeorm';
import { Db } from '../db/db';

export const TimePiece: TimePieceResolvers = {
  id: async (parent) => {
    return parent.id;
  },
  start: async (parent) => {
    return parent.start;
  },
  duration: async (parent) => {
    return parent.duration;
  },
  type: async (parent) => {
    return parent.type;
  },
};

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
  timePieces: async (parent, { first, after }) => {
    return paginate(
      {
        first,
        after,
        orderBy: {
          direction: OrderDirection.DESC,
          field: 'start',
        },
      },
      {
        type: 'TimePieceEntity',
        alias: 'timePieces',
        validateCursor: true,
        orderFieldToKey: (field) => field,
        queryBuilder: getConnection()
          .getRepository(TimePieceEntity)
          .createQueryBuilder('timePieces')
          .where('timePieces.targetId = :targetId', { targetId: parent.id }),
      }
    );
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
