import { Target } from '../entities/target';
import { TimePiece } from '../entities/timePiece';

export const targetResolver = {
  Target: {
    id: async (parent: Target, args: any, context: any, info: any) => {
      return parent.id;
    },
    created_at: async (parent: Target, args: any, context: any, info: any) => {
      return parent.created_at;
    },
    name: async (parent: Target, args: any, context: any, info: any) => {
      return parent.name;
    },
    timeSpent: async (parent: Target, args: any, context: any, info: any) => {
      return parent.timeSpent;
    },
    timePieces: async (parent: Target, args: any, context: any, info: any) => {
      return parent.timePieces;
    },
  },
  TimePiece: {
    start: async (parent: TimePiece, args: any, context: any, info: any) => {
      return parent.start;
    },
    duration: async (parent: TimePiece, args: any, context: any, info: any) => {
      return parent.duration;
    },
  },
};
