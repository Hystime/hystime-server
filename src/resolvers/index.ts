import {resolvers as scalarsResolvers} from "graphql-scalars";
import {targetResolver} from "./target";
import {queryResolvers} from "./query";
import {mutationResolver} from "./mutation";


const resolver = {
    ...scalarsResolvers,
    ...queryResolvers,
    ...targetResolver,
    ...mutationResolver
}

export default resolver
