import { Db } from '../db/db';
import { MutationResolvers, Target, TimePiece, User } from '../generated/types';

export const Mutation: MutationResolvers = {
  userCreate: async (parent, args, context, info): Promise<User | null> => {
    const { input } = args;
  },
  userUpdate: async (parent, args, context, info): Promise<User | null> => {
    const { user_id, input } = args;
  },
  targetCreate: async (parent, args, context, info): Promise<Target | null> => {
    const { input } = args;
  },
  targetUpdate: async (parent, args, context, info): Promise<Target> => {
    const { target_id, input } = args;
  },
  targetDelete: async (parent, args, context, info): Promise<boolean> => {
    const { target_id } = args;
  },
  timePieceCreate: async (parent, args, context, info): Promise<TimePiece> => {
    const { target_id, input } = args;
  },
  timePieceUpdate: async (parent, args, context, info): Promise<TimePiece> => {
    const { timepiece_id, input } = args;
  },
  timePieceDelete: async (parent, args, context, info): Promise<boolean> => {
    const { timepiece_id } = args;
  },
  timePiecesCreateForTarget: async (parent, args, context, info): Promise<TimePiece[]> => {
    const { target_id, input } = args;
  },
};
