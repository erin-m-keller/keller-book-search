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

  useEffect(() => {
    if (data) {
      setUserData(data.getUser);
    } else {
      let savedUserData = JSON.parse(localStorage.getItem("apollo-cache-persist"));
      if (savedUserData) {
        for (let [user, _] of Object.entries(savedUserData)) {
          if (user.includes("User")) {
            setUserKey(user);
            if (userKey) {
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
              setUserData(user);
            }
            return;
          }
        }
      }
    }
  }, [data, userKey]);

  
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
      console.log("bookId: ", bookId);
      // read the cache data for the current user
      const { getUser } = cache.readQuery({ query: GET_USER, variables: { email } });
      console.log("getUser: ", JSON.stringify(getUser));
      // remove the book from the savedBooks array
      const updatedUserData = {
        ...getUser,
        savedBooks: getUser.savedBooks.filter(book => book.bookId !== bookId),
        bookCount: getUser.savedBooks.length - 1 
      };
      console.log("updatedUserData: ", JSON.stringify(updatedUserData));
  
      // Generate the cache key for the user object
      const cacheKey = cache.identify({ __typename: "User", _id: getUser._id });

      // Remove the user data from the cache
      cache.evict({ id: cacheKey });
  
     // Write the modified user data back to the cache
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
      // log the error variable
      console.error(error); 
    }
  };
  

  // if loading is true and userData does not exist, show loading message
  if (loading && !userData) {
    return <div>Loading...</div>;
  }
  
  // if useQuery has error, show error message
  if (dataErr) {
    return <div>Error: {dataErr.message}</div>;
  }

  return (
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
  );
};

export default SavedBooks;
