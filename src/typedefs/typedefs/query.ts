import { gql } from 'apollo-server';

export default gql`
  type Query {
    """
    Test Connection
    """
    test: Boolean!

    """
    Try to find one user
    """
    user(username: String!): User!
  }
`;
