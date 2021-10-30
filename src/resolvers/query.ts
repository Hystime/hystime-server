import { getConnection } from 'typeorm';
import { User } from '../entities/user';

export const queryResolvers = {
  Query: {
    user: async (parent: any, args: any, context: any, info: any) => {},
  },
};
