import { resolvers as scalarsResolvers } from 'graphql-scalars';
import { targetResolver } from './target';
import { queryResolvers } from './query';
import { mutationResolver } from './mutation';
import { userResolver } from './user';

const resolver = {
  ...scalarsResolvers,
  ...queryResolvers,
  ...targetResolver,
  ...mutationResolver,
  ...userResolver,
};

export default resolver;
