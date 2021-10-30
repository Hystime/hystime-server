// mapping from inputs.graphql

export type UserInput = {
  username: string;
  targets: TargetInput[];
};

export type TargetInput = {
  name: string;
  timeSpent?: number;
  timePieces: TimePieceInput[];
};

export type TimePieceInput = {
  start: Date;
  duration: number;
};
