import { TargetInput, TimePieceInput, UserInput } from '../types/inputsType';

type addUserArgsType = {
  input: UserInput;
};
type addTargetArgsType = {
  user: string;
  input: TargetInput;
};
type addTimePiecesArgsType = {
  target_id: string;
  input: TimePieceInput[];
};

export const mutationResolver = {
  Mutation: {
    addUser: async (parent: any, args: addUserArgsType, context: any, info: any): Promise<boolean> => {
      const { input } = args;
      const username = input.username;
      return true;
    },
    addTarget: async (parent: any, args: addTargetArgsType, context: any, info: any): Promise<boolean> => {
      return true;
    },
    addTimePieces: async (parent: any, args: addTimePiecesArgsType, context: any, info: any): Promise<boolean> => {
      return true;
    },
  },
};
