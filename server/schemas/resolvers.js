// initialize variables
const { User } = require('../models'),
      { generateAuthToken } = require("../utils/auth"),
      { AuthenticationError } = require('apollo-server-express');

const resolvers = {
  // retrieve data from the server
  Query: {
    getUser: async (_, __, context) => {
      if (!context.user) throw new AuthenticationError("Not logged in");
      const { email } = context.user;
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
      // if user is not found, or password is incorrect, throw an error
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
      // if no user, throw an error
      if (!context.user) throw new Error('Not authenticated.');
      // find user by id, and push the book to the savedBooks array
      // new: true returns the updated object
      return await User.findByIdAndUpdate({ _id: context.user._id }, { $push: { savedBooks: bookData } }, { new: true });
    },
    removeBook: async (_, { bookId }, { userId }) => {
      // if no userid, throw an error
      if (!userId) throw new Error('Not authenticated.');
      // find user by id, and remove the book from the savedBooks array
      // new: true returns the updated object
      return await User.findByIdAndUpdate(userId, { $pull: { savedBooks: { bookId } } }, { new: true });
    },
  },
};

// export the resolvers
module.exports = resolvers;
