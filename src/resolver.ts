import {resolvers as scalarsResolvers} from "graphql-scalars";
import {queryResolvers, targetResolver} from "./resolvers";

const resolver = {
    ...scalarsResolvers,
    ...queryResolvers,
    ...targetResolver
}

export default resolver
