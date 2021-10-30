import {getConnection} from "typeorm";
import {User} from "../entities/user";

export const queryResolvers = {
    Query: {
        targets: async (parent: any, args: any, context: any, info: any) => {
            const user = args.user;
            const userRepo = getConnection().getRepository(User)
            const userEntity = await userRepo.findOne({username: user})
            if (!userEntity) {
                throw new Error(`User ${user} not found`)
            }
            return userEntity.targets
        }
    }
}
