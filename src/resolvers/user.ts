import { UserEntity } from '../entities/user';

export const userResolver = {
  User: {
    id: async (parent: UserEntity, args: any, context: any, info: any) => {
      return parent.id;
    },
    username: async (parent: UserEntity, args: any, context: any, info: any) => {
      return parent.username;
    },
    created_at: async (parent: UserEntity, args: any, context: any, info: any) => {
      return parent.created_at;
    },
    targets: async (parent: UserEntity, args: any, context: any, info: any) => {
      return parent.targets;
    },
  },
};
