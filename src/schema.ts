import typeDefs from './schemas/typeDefs.graphql'
import query from './schemas/query.graphql'
import {typeDefs as scalars} from 'graphql-scalars';

export default [typeDefs, query, ...scalars]
