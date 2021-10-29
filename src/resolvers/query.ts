export const queryResolvers = {
    Query: {
        targets: (root:any, args:any, context:any, info:any) => {
            const user = args.user;
        }
    }
}
