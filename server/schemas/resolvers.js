// initialize variables
const { Class } = require('../models');

const resolvers = {
  // retrieve data from the server
  Query: {
    // get the user
    getUser: async (_, __, { userId }) => {
      // if no userid, throw an error
      if (!userId) throw new Error('User not authenticated.');
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
  },
};

// export the resolvers
module.exports = resolvers;
