// initialize variables
const { Class } = require('../models');

const resolvers = {
  Query: {
    getUser: async (_, __, { userId }) => {
      // if no userid, throw an error
      if (!userId) throw new Error('User not authenticated.');
      // otherwise, find the user by ID and return
      return await User.findById(userId);
    },
  }
};

// export the resolvers
module.exports = resolvers;
