import { MutationTargetInput, MutationTimePieceInput, MutationUserInput } from '../types/inputsType';
import { Db } from '../db/db';
import { MutationAddTargetArgsType, MutationAddTimePiecesArgsType, MutationAddUserArgsType } from '../types/argsType';

export const mutationResolver = {
  Mutation: {
    createUser: async (parent: any, args: MutationAddUserArgsType, context: any, info: any): Promise<boolean> => {
      const { input } = args;
      return await Db.createUser(input);
    },
    addTarget: async (parent: any, args: MutationAddTargetArgsType, context: any, info: any): Promise<boolean> => {
      const { user, input } = args;
      return (await Db.addTarget(user, input)) as boolean;
    },
    addTimePieces: async (parent: any, args: MutationAddTimePiecesArgsType, context: any, info: any): Promise<boolean> => {
      const { target_id, input } = args;
      return (await Db.addTimePieces(target_id, input)) as boolean;
    },
  },
};
