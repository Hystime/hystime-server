import { GraphQLDate, GraphQLDateTime } from 'graphql-scalars';
import { GraphQLSchema } from 'graphql';

export default new GraphQLSchema({
  types: [GraphQLDate, GraphQLDateTime],
});
