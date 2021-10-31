import { MutationTargetInput, MutationTimePieceInput, MutationUserInput } from './inputsType';

export type MutationAddUserArgsType = {
  input: MutationUserInput;
};
export type MutationAddTargetArgsType = {
  user: string;
  input: MutationTargetInput;
};
export type MutationAddTimePieceArgsType = {
  target_id: string;
  input: MutationTimePieceInput;
};
export type MutationAddTimePiecesArgsType = {
  target_id: string;
  input: MutationTimePieceInput[];
};

export type QueryUserArgsType = {
  username: string;
};
