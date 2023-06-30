import React, { useEffect } from 'react';
import { useApolloClient } from "@apollo/client";
import { useQuery, useMutation } from '@apollo/react-hooks';
import { GET_USER } from "../utils/queries";
import { REMOVE_BOOK } from "../utils/mutations";
import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';
import {
  Container,
  Card,
  Button,
  Row,
  Col
} from 'react-bootstrap';

const SavedBooks = () => {
  const client = useApolloClient(),
        email = Auth.getProfile(),
        { loading, dataErr, data } = useQuery(GET_USER, {
          variables: { email },
          context: {
            headers: {
              Authorization: `Bearer ${Auth.getToken()}`
            }
          }
        }),
        [removeBook, { error }] = useMutation(REMOVE_BOOK);
  let userData = data?.getUser;

  useEffect(() => {
    if (!loading && !dataErr && !userData) {
      const cacheKey = client.cache.identify({ __typename: 'User', email });
      const cachedData = client.cache.readFragment({ id: cacheKey, fragment: GET_USER });
      userData = cachedData?.getUser;
    }
  }, [loading, dataErr, userData, client.cache, email]);

  console.log("cached data:", userData);

  const handleRemoveBook = async (bookId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;
    if (!token) return false;
    try {
      await removeBook({ variables: { bookId } });
      removeBookId(bookId);
      window.location.reload();
    } catch (err) {
      console.error(err);
      console.error(error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }
  
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
        <h2 className='pt-5'>
          {userData && userData.savedBooks.length
            ? `Viewing ${userData.savedBooks.length} saved ${userData.savedBooks.length === 1 ? 'book' : 'books'}:`
            : 'You have no saved books!'}
        </h2>
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
                    <Button className='btn-block btn-danger' onClick={() => handleRemoveBook(book.bookId)}>
                      Delete this Book!
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </>
  );
};

export default SavedBooks;
