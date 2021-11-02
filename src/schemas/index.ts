import typeDefs from './schema/typeDefs.graphql';
import inputs from './schema/inputs.graphql';
import query from './schema/query.graphql';
import mutations from './schema/mutation.graphql';
import { typeDefs as scalars } from 'graphql-scalars';

export default [typeDefs, query, inputs, mutations, ...scalars];
