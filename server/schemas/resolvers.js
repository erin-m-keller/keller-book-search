// initialize variables
const { User } = require('../models'),
      { generateAuthToken } = require("../utils/auth"),
      { AuthenticationError } = require('apollo-server-express');

const resolvers = {
  // retrieve data from the server
  Query: {
    // retrieve user data
    getUser: async (_, __, context) => {
      // if no user object, throw authentication error
      if (!context.user) throw new AuthenticationError("Not logged in");
      // initialize variables
      const { email } = context.user;
      // return a user object based on email, removing the __v and password fields from the object
      return await User.findOne({ email }).select("-__v -password");
    },
  },
  // modify data on the server
  Mutation: {
    // create a new user on sign up
    createUser: async (_,input) => {
      // initialize variables
      const user = await User.create(input),
            token = generateAuthToken(user);
      // return token and user object
      return { token, user };
    },
    // authenticate the user
    login: async (_, { email, password }) => {
      // initialize variables
      const user = await User.findOne({ email });
      // if user is not found, or password is incorrect, throw an authentication error
      if (!user || !(await user.isCorrectPassword(password))) {
        throw new AuthenticationError("Incorrect credentials.");
      }
      // generate a token for the authenticated user
      const token = generateAuthToken(user);
      // return the token and user object
      return { token, user };
    },
    // save the book to the users savedBooks array
    saveBook: async (_, { bookData }, context) => {
      // if no user object, throw authentication error
      if (!context.user) throw new Error('Not authenticated.');
      // find user by id
      // push the book to the savedBooks array
      // new: true returns the updated object
      const updatedUser = await User.findByIdAndUpdate(
        context.user._id,
        { $push: { savedBooks: bookData } },
        { new: true }
      );
      return updatedUser;
    },
    // remove a book from the user's savedBooks array
    removeBook: async (_, { bookId }, context) => {
      // if no user object, throw authentication error
      if (!context.user) throw new Error('Not authenticated.');
      // find the user by their ID
      // remove the book from the savedBooks array
      // new: true returns the updated object
      const updatedUser = await User.findByIdAndUpdate(
        context.user._id,
        { $pull: { savedBooks: { bookId } } },
        { new: true }
      );
      // return the updated user object
      console.log("updatedUser: ", JSON.stringify(updatedUser));
      return updatedUser;
    },
  },
};

// export the resolvers
module.exports = resolvers;
