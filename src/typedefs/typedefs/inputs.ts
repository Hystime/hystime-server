import { gql } from 'apollo-server';

export default gql`
  input UserCreateInput {
    username: String!
    targets: [TargetCreateInput!]
  }

  input UserUpdateInput {
    username: String
  }

  input TargetCreateInput {
    name: String!
    timeSpent: Int
    type: TargetType
    timePieces: [TimePieceCreateInput!]
  }

  input TargetUpdateInput {
    name: String
    timeSpent: Int
    type: TargetType
  }

  input TimePieceCreateInput {
    start: DateTime!
    duration: Int!
    type: TimePieceType
  }

  input TimePieceUpdateInput {
    start: DateTime
    duration: Int
    type: TimePieceType
  }
`;
