import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { ApolloProvider } from "@apollo/react-hooks";
import ApolloClient from "apollo-boost";
import SearchBooks from './pages/SearchBooks';
import SavedBooks from './pages/SavedBooks';
import Navbar from './components/Navbar';

const client = new ApolloClient({
  // request interceptor to modify the outgoing GraphQL requests
  request: operation => {
    // retrieve the token from localStorage
    const token = localStorage.getItem('jwtToken');
    // set the authorization header for each GraphQL operation
    operation.setContext({
      headers: { authorization: token ? `Bearer ${token}` : '' }
    });
  },
  // the URI of the GraphQL server
  uri: 'http://localhost:3001/graphql'
});

// clear the Apollo Client cache
client.clearStore();

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <>
          <Navbar />
          <Switch>
            <Route exact path='/' component={SearchBooks} />
            <Route exact path='/saved' component={SavedBooks} />
            <Route render={() => <h1 className='display-2'>Wrong page!</h1>} />
          </Switch>
        </>
      </Router>
    </ApolloProvider>
  );
}

export default App;
