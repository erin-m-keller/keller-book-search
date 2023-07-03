import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { persistCache } from 'apollo-cache-persist';
import SearchBooks from './pages/SearchBooks';
import SavedBooks from './pages/SavedBooks';
import Navbar from './components/Navbar';
import ErrorBoundary from './components/ErrorBoundary';
import { ThemeProvider, createTheme } from '@mui/system';

// custom merge function for the savedBooks field
const mergeSavedBooks = (_, incoming) => {
  return incoming;
};

// set up cache with the custom merge function
const cache = new InMemoryCache({
  typePolicies: {
    User: {
      fields: {
        savedBooks: {
          merge: mergeSavedBooks
        }
      }
    }
  }
});

// persist the Apollo cache to local storage
async function persistApolloCache() {
  // specify the cache instance and use window.localStorage as the storage medium
  await persistCache({
    cache,                            
    storage: window.localStorage,   
  });
}

// call function to persist the cache
persistApolloCache();

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
  uri: '/graphql',
  cache
});

// clear the Apollo Client cache
client.clearStore();

// create mui theme
const theme = createTheme();

function App() {
  return (
    <ThemeProvider theme={theme}>
      <ApolloProvider client={client}>
        <Router>
          <ErrorBoundary>
            <>
              <Navbar />
              <Switch>
                <Route exact path='/' component={SearchBooks} />
                <Route exact path='/book-list' component={SavedBooks} />
                <Route render={() => <h1 className='display-2'>Wrong page!</h1>} />
              </Switch>
            </>
          </ErrorBoundary>
        </Router>
      </ApolloProvider>
    </ThemeProvider>
  );
}

export default App;
