import React, { useState, useEffect } from 'react';
import { SAVE_BOOK } from '../utils/mutations.js';
import { useMutation } from "@apollo/client";
import Auth from '../utils/auth';
import { searchGoogleBooks } from '../utils/API';
import { saveBookIds, getSavedBookIds } from '../utils/localStorage';
import {
  Container,
  Col,
  Form,
  Button,
  Card,
  Row
} from 'react-bootstrap';

const SearchBooks = () => {
  // initialize variables
  const [searchedBooks, setSearchedBooks] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [savedBookIds, setSavedBookIds] = useState(getSavedBookIds());
  const [saveBook, { error }] = useMutation(SAVE_BOOK);

  useEffect(() => {
    // cleanup function
    return () => {
      // save the `savedBookIds` state
      saveBookIds(savedBookIds);
    };
  });

  // handle form submission event
  const handleFormSubmit = async (event) => {
    // prevent default behavior
    event.preventDefault();
    // if no input, return false
    if (!searchInput) return false;
    try {
      // initialize variables
      const response = await searchGoogleBooks(searchInput);
      // if there was an error, throw an error
      if (!response.ok) throw new Error('something went wrong!');
      // get the searched books from the request and transform to json
      const { items } = await response.json();
      // map through the data and create objects
      const bookData = items.map((book) => ({
        bookId: book.id,
        authors: book.volumeInfo.authors || ['No author to display'],
        title: book.volumeInfo.title,
        description: book.volumeInfo.description,
        image: book.volumeInfo.imageLinks?.thumbnail || '',
      }));
      // set searched books value
      setSearchedBooks(bookData);
      // clear the search input
      setSearchInput('');
    } catch (err) {
      // log error
      console.error("Try/Catch Error: " + err);
    }
  };

  // create function to handle saving a book to our database
  const handleSaveBook = async (bookId) => {
    // initialize variables
    const bookToSave = searchedBooks.find((book) => book.bookId === bookId),
          token = Auth.loggedIn() ? Auth.getToken() : null;
    // if no token, return false
    if (!token) return false;
    try {
      // initialize variables
      const bookData = {
        bookId: bookToSave.bookId,
        authors: bookToSave.authors,
        title: bookToSave.title,
        description: bookToSave.description,
        image: bookToSave.image,
        link: bookToSave.link
      },
      { data } = await saveBook({ variables: { bookData } });
      // if there was an error, throw an error
      if (!data) throw new Error('something went wrong!');
      // access the saved book data from the response
      const savedBookData = data.saveBook;
      // if book successfully saves to user's account, save book id to state
      setSavedBookIds([...savedBookIds, savedBookData.bookId]);
    } catch (err) {
      // log error
      console.error("Try/Catch Error: " + err);
      // log mutation error
      console.error("Mutation error: " + error);
    }
  };

  return (
    <>
      <div className='text-light bg-dark pt-5'>
        <Container>
          <h1>Search for Books!</h1>
          <Form onSubmit={handleFormSubmit}>
            <Row>
              <Col xs={12} md={8}>
                <Form.Control
                  name='searchInput'
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  type='text'
                  size='lg'
                  placeholder='Search for a book'
                />
              </Col>
              <Col xs={12} md={4}>
                <Button type='submit' variant='success' size='lg'>
                  Submit Search
                </Button>
              </Col>
            </Row>
          </Form>
        </Container>
      </div>

      <Container>
        <h2 className='pt-5'>
          {searchedBooks.length
            ? `Viewing ${searchedBooks.length} results:`
            : 'Search for a book to begin'}
        </h2>
        <Row>
          {searchedBooks.map((book) => {
            return (
              <Col md="4" key={book.bookId}>
                <Card border='dark'>
                  {book.image ? (
                    <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' />
                  ) : null}
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <p className='small'>Authors: {book.authors}</p>
                    <Card.Text>{book.description}</Card.Text>
                    {Auth.loggedIn() && (
                      <Button
                        disabled={savedBookIds?.some((savedBookId) => savedBookId === book.bookId)}
                        className='btn-block btn-info'
                        onClick={() => handleSaveBook(book.bookId)}>
                        {savedBookIds?.some((savedBookId) => savedBookId === book.bookId)
                          ? 'This book has already been saved!'
                          : 'Save this Book!'}
                      </Button>
                    )}
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

export default SearchBooks;
