import { Db } from '../db/db';
import { MutationResolvers, Target, TimePiece, User } from '../generated/types';

export const Mutation: MutationResolvers = {
  userCreate: async (parent, { input }, context, info): Promise<User | null> => {
    return Db.createUser(input);
  },
  userUpdate: async (parent, { user_id, input }, context, info): Promise<User | null> => {
    return Db.updateUser(user_id, input);
  },
  targetCreate: async (parent, { user_id, input }, context, info): Promise<Target | null> => {
    return Db.createTarget(user_id, input);
  },
  targetUpdate: async (parent, { target_id, input }, context, info): Promise<Target | null> => {
    return Db.updateTarget(target_id, input);
  },
  targetDelete: async (parent, { target_id }, context, info): Promise<boolean> => {
    return Db.deleteTarget(target_id);
  },
  timePieceCreate: async (parent, { target_id, input }, context, info): Promise<TimePiece | null> => {
    return Db.createTimePiece(target_id, input);
  },
  timePieceUpdate: async (parent, { timepiece_id, input }, context, info): Promise<TimePiece | null> => {
    return Db.updateTimePiece(timepiece_id, input);
  },
  timePieceDelete: async (parent, { timepiece_id }, context, info): Promise<boolean> => {
    return Db.deleteTimePiece(timepiece_id);
  },
  timePiecesCreateForTarget: async (parent, { target_id, input }, context, info): Promise<TimePiece[] | null> => {
    return Db.createTimePieces(target_id, input);
  },
};
