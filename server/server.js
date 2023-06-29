// load environment variables into the application
require('dotenv').config();

// initialize variables
const express = require('express'),
      { ApolloServer } = require('apollo-server-express'),
      { typeDefs, resolvers } = require('./schemas'),
      db = require('./config/connection'),
      PORT = process.env.PORT || 3001,
      server = new ApolloServer({
        typeDefs,
        resolvers
      }),
      app = express();

// configuring Express to parse URL-encoded data
app.use(express.urlencoded({ extended: false })); 
// configuring Express to parse JSON data
app.use(express.json()); 

// create a new instance of an Apollo server with the GraphQL schema
const startApolloServer = async () => {
  // starting the ApolloServer
  await server.start(); 
  // applying the Apollo middleware to the Express app
  server.applyMiddleware({ app }); 

  // once the database connection is open
  db.once('open', () => { 
    // start the server and listen on the specified port
    app.listen(PORT, () => { 
      console.log(`API server running on port ${PORT}!`); 
      console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`); 
    });
  });
};

// call the async function to start the server
startApolloServer();