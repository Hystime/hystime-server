import { Db } from '../db/db';
import { MutationResolvers, Target, TimePiece, User } from '../generated/types';

export const Mutation: MutationResolvers = {
  userCreate: async (parent, { input }, context, info): Promise<User | null> => {
    return Db.createUser(input);
  },
  userUpdate: async (parent, { user_id, input }, context, info): Promise<User | null> => {
    return Db.updateUser(user_id, input);
  },
  targetCreate: async (parent, { input }, context, info): Promise<Target | null> => {
    return Db.createTarget(input);
  },
  targetUpdate: async (parent, args, context, info): Promise<Target|null> => {
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
