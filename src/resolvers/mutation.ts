import { Db } from '../db/db';
import { MutationResolvers, Target, TimePiece, User } from '../generated/types';

export const Mutation: MutationResolvers = {
  userCreate: async (parent, { input }, context, info) => {
    return Db.createUser(input);
  },
  userUpdate: async (parent, { user_id, input }, context, info) => {
    return Db.updateUser(user_id, input);
  },
  targetCreate: async (parent, { user_id, input }, context, info) => {
    return Db.createTarget(user_id, input);
  },
  targetUpdate: async (parent, { target_id, input }, context, info) => {
    return Db.updateTarget(target_id, input);
  },
  targetDelete: async (parent, { target_id }, context, info) => {
    return Db.deleteTarget(target_id);
  },
  timePieceCreate: async (parent, { target_id, input }, context, info) => {
    return Db.createTimePiece(target_id, input);
  },
  timePieceUpdate: async (parent, { timepiece_id, input }, context, info) => {
    return Db.updateTimePiece(timepiece_id, input);
  },
  timePieceDelete: async (parent, { timepiece_id }, context, info) => {
    return Db.deleteTimePiece(timepiece_id);
  },
  timePiecesCreateForTarget: async (parent, { target_id, input }, context, info) => {
    return Db.createTimePieces(target_id, input);
  },
};
