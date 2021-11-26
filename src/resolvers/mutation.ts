import { Db } from '../db/db';
import { MutationResolvers} from '../generated/types';

export const Mutation: MutationResolvers = {
  userCreate: async (parent, { input }) => {
    return Db.createUser(input);
  },
  userUpdate: async (parent, { user_id, input }) => {
    return Db.updateUser(user_id, input);
  },
  targetCreate: async (parent, { user_id, input }) => {
    return Db.createTarget(user_id, input);
  },
  targetUpdate: async (parent, { target_id, input }) => {
    return Db.updateTarget(target_id, input);
  },
  targetDelete: async (parent, { target_id }) => {
    return Db.deleteTarget(target_id);
  },
  timePieceCreate: async (parent, { target_id, input }) => {
    return Db.createTimePiece(target_id, input);
  },
  timePieceUpdate: async (parent, { timepiece_id, input }) => {
    return Db.updateTimePiece(timepiece_id, input);
  },
  timePieceDelete: async (parent, { timepiece_id }) => {
    return Db.deleteTimePiece(timepiece_id);
  },
  timePiecesCreateForTarget: async (parent, { target_id, input }) => {
    return Db.createTimePieces(target_id, input);
  },
};
