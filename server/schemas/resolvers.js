// initialize variables
const { Class } = require('../models');

const resolvers = {
  // retrieve data from the server
  Query: {
    // get the user
    getUser: async (_, __, { userId }) => {
      // if no userid, throw an error
      if (!userId) throw new Error('Not authenticated.');
      // otherwise, find the user by ID and return
      return await User.findById(userId);
    },
  },
  // modify data on the server
  Mutation: {
    // create a new user on sign up
    createUser: async (_, { input }) => {
      // initialize variables
      const { username, email, password } = input;
      // create the user with username, email, and password
      return await User.create({ username, email, password });
    },
    // save the book to the users savedBooks array
    saveBook: async (_, { bookData }, { userId }) => {
      // if no userid, throw an error
      if (!userId) throw new Error('Not authenticated.');
      // find user by id, and push the book to the savedBooks array
      // new: true returns the updated object
      return await User.findByIdAndUpdate(userId, { $push: { savedBooks: bookData } }, { new: true });
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
