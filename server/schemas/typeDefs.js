// initialize variables
const { gql } = require('apollo-server-express');

// define the GraphQL type definitions
const typeDefs = gql`
  type Book {
    authors: [String]
    description: String!
    bookId: String!
    image: String
    link: String
    title: String!
  }
  type User {
    _id: ID!
    username: String!
    email: String!
    savedBooks: [Book]!
    bookCount: Int!
  }
  input BookInput {
    authors: [String]
    description: String!
    bookId: String!
    image: String
    link: String
    title: String!
  }
  input CreateUserInput {
    username: String!
    email: String!
    password: String!
  }
  type Query {
    getUser: User
  }
  type Auth {
    token: String!
    user: User!
  }
  type Mutation {
    createUser(username: String!, email: String!, password: String!): Auth
    login(email: String!, password: String!): Auth
    saveBook(bookData: BookInput!): User
    removeBook(bookId: String!): User
  }
`;

// export typedefs
module.exports = typeDefs;
