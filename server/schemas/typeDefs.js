// initialize variables
const { gql } = require('apollo-server-express');

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
  type Mutation {
    createUser(input: CreateUserInput!): User
    saveBook(bookData: BookInput!): User
    removeBook(bookId: String!): User
  }
`;

// export typedefs
module.exports = typeDefs;
