import { TimePieceResolvers } from '../generated/types';

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
  target: async (parent) => {
    return parent.target;
  },
};
