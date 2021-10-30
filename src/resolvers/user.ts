import { User } from '../entities/user';

export const userResolver = {
  User: {
    id: async (parent: User, args: any, context: any, info: any) => {
      return parent.id;
    },
    username: async (parent: User, args: any, context: any, info: any) => {
      return parent.username;
    },
    created_at: async (parent: User, args: any, context: any, info: any) => {
      return parent.created_at;
    },
    targets: async (parent: User, args: any, context: any, info: any) => {
      return parent.targets;
    },
  },
};
