import { gql } from 'apollo-server';

export default gql`
  enum TargetType {
    NORMAL
    LONGTERM
  }

  enum TimePieceType {
    NORMAL
    POMODORO
  }

  """
  User
  """
  type User {
    """
    User ID
    """
    id: ID!

    """
    Create Time
    """
    created_at: DateTime!

    """
    Username
    """
    username: String!

    """
    Targets
    """
    targets: [Target!]

    """
    Find a target by ID
    """
    target(id: ID!): Target!

    """
    Timepieces in the last week
    """
    lastWeekTimePieces: [TimePiece!]!

    """
    Total focus time length
    """
    timeSpent: Int!

    """
    Today focus time length
    """
    todayTimeSpent: Int!

    """
    Total pomodoro count
    """
    pomodoroCount: Int!

    """
    Today pomodoro count
    """
    todayPomodoroCount: Int!

    """
    Consumption time periods
    """
    timePieces(first: Int!, after: String): TimePieceConnection!

    """
    Generate heatMap
    """
    heatMap(end: Date): HeatMap!
  }

  """
  One Target
  """
  type Target {
    """
    Target ID
    """
    id: ID!

    """
    Create Time
    """
    created_at: DateTime!

    """
    Target name
    """
    name: String!

    """
    Target type
    """
    type: TargetType

    """
    Time spent on this target
    """
    timeSpent: Int!

    """
    Consumption time periods
    """
    timePieces(first: Int!, after: String): TimePieceConnection!

    """
    Timepieces in the last week
    """
    lastWeekTimePieces: [TimePiece!]!

    """
    Today focus time length
    """
    todayTimeSpent: Int!

    """
    Total pomodoro count
    """
    pomodoroCount: Int!

    """
    Today pomodoro count
    """
    todayPomodoroCount: Int!

    """
    Generate HeatMap
    """
    heatMap(end: Date): HeatMap!
  }

  type HeatMap {
    start: Date!
    end: Date!
    data: [Int!]!
  }

  type TimePieceEdge {
    node: TimePiece!
    cursor: String!
  }

  type TimePieceConnection {
    totalCount: Int!
    edges: [TimePieceEdge!]!
    pageInfo: PageInfo!
  }

  """
  One Time Piece
  """
  type TimePiece {
    """
    TimePiece ID
    """
    id: Int!

    """
    Piece start time
    """
    start: DateTime!

    """
    Time spend on this piece, count as seconds
    """
    duration: Int!

    """
    Timepiece type
    """
    type: TimePieceType

    """
    Target this piece belongs to
    """
    target: Target!
  }
`;
