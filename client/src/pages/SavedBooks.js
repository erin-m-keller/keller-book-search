import React, { useEffect, useState } from 'react';
import { useApolloClient, gql } from "@apollo/client";
import { useQuery, useMutation } from '@apollo/react-hooks';
import { GET_USER } from "../utils/queries";
import { REMOVE_BOOK } from "../utils/mutations";
import Auth from '../utils/auth';
import {
  Container,
  Card,
  Button,
  Row,
  Col
} from 'react-bootstrap';

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
        cache = apolloClient.cache;

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
  }, [data, userKey]);

  // remove a selected book from the savedBooks array
  const removeBookFromSavedBooks = async (bookId) => {
    // initialize variables
    const token = Auth.getToken(); 
    // if token doesn't exist, return false
    if (!token) return false;
    try {
      // remove the book using the ID
      let updatedObj = await removeBook({
        variables: { bookId }, // set the bookId for the mutation
        context: headers, // set the authorization headers
      });
      // read the cache data for the current user
      const { getUser } = cache.readQuery({ query: GET_USER, variables: { email } });
      // remove the book from the savedBooks array
      const updatedUserData = {
        ...getUser,
        savedBooks: getUser.savedBooks.filter(book => book.bookId !== bookId),
        bookCount: getUser.savedBooks.length - 1
      };
      // generate the cache key for the user object
      const cacheKey = cache.identify({ __typename: "User", _id: getUser._id });
      // remove the user data from the cache
      cache.evict({ id: cacheKey });
      // write the modified user data back to the cache
      cache.writeQuery({
        query: GET_USER,
        variables: { email },
        data: {
          getUser: {
            ...updatedUserData
          }
        }
      });
      // update the user data with the updated object
      setUserData(updatedObj);
    } catch (err) {
      // log any errors occurred during the mutation
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

  return (
    <>
      {Auth.loggedIn() ? (
        <>
          <div fluid="true" className='text-light bg-dark p-5'>
            <Container>
              <h1>Viewing saved books!</h1>
            </Container>
          </div>
          <Container>
          {userData && userData.savedBooks ?
            <div>
              <h2 className='pt-5'>Viewing {userData.savedBooks.length} saved {userData.savedBooks.length === 1 ? 'book' : 'books'}:</h2>
              <Row>
                {userData && userData.savedBooks.map((book, index) => {
                  return (
                    <Col md="4" key={index}>
                      <Card border='dark'>
                        {book.image ? <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' /> : null}
                        <Card.Body>
                          <Card.Title>{book.title}</Card.Title>
                          <p className='small'>Authors: {book.authors}</p>
                          <Card.Text>{book.description}</Card.Text>
                          <Button className='btn-block btn-danger' onClick={() => removeBookFromSavedBooks(book.bookId)}>
                            Delete this Book!
                          </Button>
                        </Card.Body>
                      </Card>
                    </Col>
                  );
                })}
              </Row>
            </div>
            :
            <h2 className='pt-5'>You have no saved books!</h2>
            }
          </Container>
        </>
      ) : (
        <div fluid="true" className='text-light bg-dark p-5'>
          <Container>
            <h1>You must be logged in to view this page.</h1>
          </Container>
        </div>
      )}
    </>
  );
};

export default SavedBooks;
