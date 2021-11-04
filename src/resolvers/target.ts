import { TargetResolvers, TimePieceResolvers } from '../generated/types';

export const TimePiece: TimePieceResolvers = {
  async id(parent, args, context, info) {
    return parent.id;
  },
  start: async (parent, args, context, info) => {
    return parent.start;
  },
  duration: async (parent, args, context, info) => {
    return parent.duration;
  },
  type: async (parent, args, context, info) => {
    return parent.type;
  },
};

export const Target: TargetResolvers = {
  id: async (parent, args, context, info) => {
    return parent.id;
  },
  type: async (parent, args, context, info) => {
    return parent.type;
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
