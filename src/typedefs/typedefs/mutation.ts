import { gql } from 'apollo-server';

export default gql`
  type Mutation {
    """
    Add a user
    """
    userCreate(input: UserCreateInput!): User

    """
    Update a user
    """
    userUpdate(user_id: ID!, input: UserUpdateInput!): User

    """
    Add a target
    """
    targetCreate(user_id: ID!, input: TargetCreateInput!): Target

    """
    Update a target
    """
    targetUpdate(target_id: ID!, input: TargetUpdateInput!): Target

    """
    Delete a target
    """
    targetDelete(target_id: ID!): Boolean

    """
    Add timePiece for particular target
    """
    timePieceCreate(target_id: String!, input: TimePieceCreateInput!): TimePiece

    """
    Update a timePiece
    """
    timePieceUpdate(timepiece_id: Int!, input: TimePieceUpdateInput!): TimePiece

    """
    Delete a timePiece
    """
    timePieceDelete(timepiece_id: Int!): Boolean

    """
    Add timePieces for particular target
    """
    timePiecesCreateForTarget(target_id: String!, input: [TimePieceCreateInput!]!): [TimePiece!]
  }
`;
