import {gql} from "apollo-server";

export const targetSchema = gql`
    type Query {
        """
        Test Message.
        """
        testMessage: String!
    }
`

export const targetResolver = {
    Query: {
        testMessage: (): string => 'Hello World!',
    },
};
