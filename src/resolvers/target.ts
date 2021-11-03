import { TargetResolvers, TimePieceResolvers } from '../generated/types';

export const TimePiece: TimePieceResolvers = {
  start: async (parent, args, context, info) => {
    return parent.start;
  },
  duration: async (parent, args, context, info) => {
    return parent.duration;
  },
};

export const Target: TargetResolvers = {
  id: async (parent, args, context, info) => {
    return parent.id;
  },
  created_at: async (parent, args, context, info) => {
    return parent.created_at;
  },
  name: async (parent, args, context, info) => {
    return parent.name;
  },
  timeSpent: async (parent, args, context, info) => {
    return parent.timeSpent;
  },
  timePieces: async (parent, args, context, info) => {
    return parent.timePieces;
  },
};
