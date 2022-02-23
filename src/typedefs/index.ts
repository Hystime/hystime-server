import typeDefs from './typedefs/typeDefs';
import inputs from './typedefs/inputs';
import mutation from './typedefs/mutation';
import query from './typedefs/query';
import pagination from './typedefs/pagination';
import { typeDefs as scalars } from 'graphql-scalars';
import gql from 'graphql-tag';

export default [gql(scalars.join('\n')), typeDefs, inputs, mutation, query, pagination];
