import typeDefs from './typeDefs.graphql';
import query from './query.graphql';
import inputs from './inputs.graphql';
import mutations from './mutation.graphql';
import { typeDefs as scalars } from 'graphql-scalars';

export default [typeDefs, query, inputs, mutations, ...scalars];
