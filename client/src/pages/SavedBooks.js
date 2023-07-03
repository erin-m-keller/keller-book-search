import React, { useEffect, useState } from 'react';
import { useApolloClient, gql } from "@apollo/client";
import { useQuery, useMutation } from '@apollo/react-hooks';
import { GET_USER } from "../utils/queries";
import { REMOVE_BOOK } from "../utils/mutations";
import Auth from '../utils/auth';
import { removeBookFromList } from '../utils/localStorage';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp, faBookmark, faBook } from '@fortawesome/free-solid-svg-icons';
import {
  Card,
  CardActions,
  CardContent,
  Collapse,
  Snackbar,
  Typography
} from '@material-ui/core';

const SavedBooks = () => {
  // initialize variables
  const headers = {
          headers: {
            Authorization: `Bearer ${Auth.getToken()}`
          }
        },
        email = Auth.getProfile(),
        { loading, dataErr, data } = useQuery(GET_USER, {
          variables: { email },
          context: headers
        }),
        [removeBook, { error }] = useMutation(REMOVE_BOOK),
        [userData, setUserData] = useState(null),
        [userKey, setUserKey] = useState(null),
        apolloClient = useApolloClient(),
        cache = apolloClient.cache,
        [showSnack, setShowSnack] = useState(false),
        [expandedCardId, setExpandedCardId] = useState(null);

  // runs code in response to certain events or 
  // conditions, such as when the component mounts,
  // updates, or unmounts
  useEffect(() => {
    // if query data exists, set the user data with the query data
    if (data) {
      setUserData(data.getUser); 
    } 
    // else, if query data is not available, pull 
    // the data from persistent cache
    else {
      let savedUserData = JSON.parse(localStorage.getItem("apollo-cache-persist")); 
      if (savedUserData) {
        // loop through the object to get the id
        for (let [user, _] of Object.entries(savedUserData)) {
          console.log(_);
          // if key includes user, get the value of the id
          if (user.includes("User")) {
            setUserKey(user);
            // if userKey exists 
            if (userKey) {
              // read the cache from local storage using 
              // the userKey to identify the correct object
              let user = apolloClient.readFragment({
                id: userKey, 
                fragment: gql`
                  fragment UserFragment on User {
                    __typename
                    _id
                    username
                    email
                    bookCount
                    savedBooks {
                      __typename
                      bookId
                      authors
                      title
                      description
                      image
                      link
                    }
                  }
                `,
              });
              // set the user data to the persistent cache
              setUserData(user); 
            }
            return;
          }
        }
      }
    }
  }, [data, userKey, apolloClient]);

  // remove a selected book from the savedBooks array
  const removeBookFromSavedBooks = async (bookId) => {
    // initialize variables
    const token = Auth.getToken();
    // if no token, return false
    if (!token) return false; 
  
    try {
      // call the `removeBook` function asynchronously with variables and headers
      await removeBook({ variables: { bookId }, context: headers }); 
      // create an updatedUserData object with the updated savedBooks and bookCount
      const updatedUserData = { 
        ...userData,
         savedBooks: userData.savedBooks.filter((book) => book.bookId !== bookId), // filter out the book with the given bookId from the savedBooks array, 
         bookCount: userData.savedBooks.length > 0 ? userData.savedBooks.length - 1 : 0 // update the book count based on the updated savedBooks array
      }; 
      // create a cache key using the data provided
      const cacheKey = cache.identify(userData);
      // remove the user data from the cache
      cache.evict({ id: cacheKey }); 
      // write the updatedUserData to the cache
      cache.writeQuery({ 
        query: GET_USER, 
        variables: { email }, 
        data: { 
          getUser: { ...updatedUserData } 
        } 
      }); 
      // update the user data with the updatedUserData
      setUserData(updatedUserData);
      // remove the book from the list
      removeBookFromList(bookId);
      // set showSnack to true to display a notification/snackbar 
      setShowSnack(true); 
    } catch (err) {
      // log the error
      console.error(err); 
    }
  };

  // if loading is true and userData does not exist, show loading message
  if (loading && !userData) {
    return <div>Loading...</div>;
  }
  // if useQuery has an error, show error message
  if (dataErr) {
    return <div>Error: {dataErr.message}</div>;
  }
  // if useMutation has an error, show error message
  if (error) {
    return <div>Error: {error.message}</div>;
  }

  // handles card expand/collapse
  const handleCardExpand = (bookId) => {
    // update the expandedCardId state based on the clicked bookId
    setExpandedCardId((prevCardId) => (prevCardId === bookId ? null : bookId));
  };

  return (
    <>
      {Auth.loggedIn() ? (
        <>
          <div className='hero pt-5'>
            <div className="container p-4">
              <Typography variant="h3">Viewing saved books!</Typography>
              <FontAwesomeIcon icon={faBook} aria-label="A book" size="6x" className="hero-book" />
            </div>
          </div>
          <div className='container p-4'>
            {userData && userData.savedBooks ?
              <>
                <Typography variant="h4">You have {userData.savedBooks.length} saved {userData.savedBooks.length === 1 ? 'book' : 'books'}:</Typography>
                <div className='card-wrapper'>
                {userData &&
                  userData.savedBooks.map((book) => {
                    const isCardExpanded = expandedCardId === book.bookId;
                    return (
                      <Card sx={{ maxWidth: 345 }} key={book.bookId} className='card-wrapper-item'>
                        {book.image ? (
                          <img src={book.image} alt={`The cover for ${book.title}`} className='book-cover' />
                        ) : null}
                        <CardContent>
                          <Typography gutterBottom variant='h5' component='div'>
                            {book.title}
                          </Typography>
                          <p className='small'>Authors: {book.authors}</p>
                        </CardContent>
                        <CardActions>
                          <span className='card-icon-bookmark-btn' onClick={() => removeBookFromSavedBooks(book.bookId)}>
                            <FontAwesomeIcon 
                              icon={faBookmark} 
                              aria-label={`${book.title} is saved`} 
                              className="bookmark" />&nbsp;&nbsp;&nbsp;<strong>Remove</strong>
                          </span>
                          <span className='card-icon-btn'>
                            <FontAwesomeIcon
                              icon={isCardExpanded ? faChevronUp : faChevronDown}
                              onClick={() => handleCardExpand(book.bookId)}
                              aria-expanded={isCardExpanded}
                              aria-label={isCardExpanded ? 'Hide' : 'Show'}
                            />
                          </span>
                        </CardActions>
                        {expandedCardId === book.bookId && (
                          <Collapse in={isCardExpanded} timeout='auto' id={book.bookId} unmountOnExit>
                            <CardContent>
                              <Typography paragraph>{book.description}</Typography>
                            </CardContent>
                          </Collapse>
                        )}
                      </Card>
                    );
                  })}
                </div>
              </>
            :
              <Typography variant="h4">You have no saved books!</Typography>
            }
          </div>
          <Snackbar
            open={showSnack}
            autoHideDuration={6000}
            onClose={() => setShowSnack(false)}
            message="Book removed from list!"
          />
        </>
      ) : (
        <div fluid="true" className='text-light bg-dark p-5'>
          <div className='container p-4'>
            <h1>You must be logged in to view this page.</h1>
          </div>
        </div>
      )}
    </>
  );
};

export default SavedBooks;
