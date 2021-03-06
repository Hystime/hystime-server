import { gql } from 'apollo-server';

export default gql`
  enum OrderDirection {
    ASC
    DESC
  }

  type PageInfo {
    """
    The first cursor in the page.
    """
    startCursor: String

    """
    The last cursor in the page.
    """
    endCursor: String

    """
    Is there another page after.
    """
    hasNextPage: Boolean!

    """
    Is there a preceding page.
    """
    hasPreviousPage: Boolean!
  }
`;
