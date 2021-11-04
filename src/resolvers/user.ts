import { UserResolvers } from '../generated/types';

export const User: UserResolvers = {
  id: async (parent, args, context, info) => {
    return parent.id;
  },
  username: async (parent, args, context, info) => {
    return parent.username;
  },
  created_at: async (parent, args, context, info) => {
    return parent.created_at;
  },
  targets: async (parent, args, context, info) => {
    return parent.targets;
  },
};
