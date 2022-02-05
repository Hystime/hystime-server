import { Mutation } from './mutation';
import { Query } from './query';
import { Target } from './target';
import { TimePiece } from './timePiece';
import { User } from './user';
import { resolvers as scalarResolvers } from 'graphql-scalars';

export default {
  Mutation,
  Query,
  Target,
  TimePiece,
  User,
  ...scalarResolvers,
};
