// mapping from inputs.graphql

export type MutationUserInput = {
  username?: string;
  targets?: MutationTargetInput[];
};

export type MutationTargetInput = {
  name?: string;
  timeSpent?: number;
  timePieces?: MutationTimePieceInput[];
};

export type MutationTimePieceInput = {
  start?: Date;
  duration?: number;
  type?: 'normal' | 'pomodoro';
};
