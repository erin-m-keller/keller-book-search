import gql from 'graphql-tag';

export const GET_USER = gql`
  query getUser {
    getUser {
      _id
      username
      email
      bookCount
      savedBooks {
        bookId
        authors
        title
        description
        image
        link
      }
    }
  }
`;