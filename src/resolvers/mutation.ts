import { Db } from '../db/db';
import {
  MutationAddTargetArgsType,
  MutationAddTimePieceArgsType,
  MutationAddTimePiecesArgsType,
  MutationAddUserArgsType,
} from '../types/argsType';
import { necessary } from './utils';

export const mutationResolver = {
  Mutation: {
    createUser: async (parent: any, args: MutationAddUserArgsType, context: any, info: any): Promise<boolean> => {
      const { input } = args;
      necessary(input, 'username');
      return await Db.createUser(input);
    },
    addTarget: async (parent: any, args: MutationAddTargetArgsType, context: any, info: any): Promise<boolean> => {
      const { user, input } = args;
      necessary(input, 'name');
      return await Db.addTarget(user, input);
    },
    addTimePiece: async (parent: any, args: MutationAddTimePieceArgsType, context: any, info: any): Promise<boolean> => {
      const { target_id, input } = args;
      necessary(input, 'start', 'duration');
      return await Db.addTimePiece(target_id, input);
    },
    addTimePieces: async (parent: any, args: MutationAddTimePiecesArgsType, context: any, info: any): Promise<boolean> => {
      const { target_id, input } = args;
      for (const mutationTimePieceInput of input) {
        necessary(mutationTimePieceInput, 'start', 'duration');
      }
      return await Db.addTimePieces(target_id, input);
    }
  }
};
