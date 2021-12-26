import typeDefs from './typedefs/typeDefs.graphql';
import inputs from './typedefs/inputs.graphql';
import query from './typedefs/query.graphql';
import mutations from './typedefs/mutation.graphql';
import pagination from './typedefs/pagination.graphql';
import { typeDefs as scalars } from 'graphql-scalars';
import gql from 'graphql-tag';

export default [typeDefs, query, inputs, mutations, pagination, ...scalars].map((str) => gql(str));
