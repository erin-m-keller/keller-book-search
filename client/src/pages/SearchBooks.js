import React, { useState, useEffect } from 'react';
import { SAVE_BOOK } from '../utils/mutations.js';
import { useMutation } from "@apollo/client";
import Auth from '../utils/auth';
import { searchGoogleBooks } from '../utils/API';
import { saveBookList, getBookList } from '../utils/localStorage';
import {
  Container,
  Col,
  Form,
  Card,
  Row
} from 'react-bootstrap';

import {
  AppBar,
  Box,
  Button,
  FormControl,
  FormLabel,
  IconButton,
  Modal,
  Tab,
  Tabs,
  Toolbar,
  TextField,
  Typography
} from '@material-ui/core';

const SearchBooks = () => {
  // initialize variables
  const headers = {
          headers: {
            Authorization: `Bearer ${Auth.getToken()}`
          }
        },
        [searchedBooks, setSearchedBooks] = useState([]),
        [searchInput, setSearchInput] = useState(''),
        [saveBook, { error }] = useMutation(SAVE_BOOK),
        [bookList, setBookList] = useState(getBookList());

  // runs code in response to certain events or 
  // conditions, such as when the component mounts,
  // updates, or unmounts
  useEffect(() => {
    saveBookList(bookList);
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
      { data } = await saveBook({ 
        variables: { bookData }, // set the bookData for the mutation
        context: headers, // set the authorization headers 
      });
      // if there was an error, throw an error
      if (!data) throw new Error('something went wrong!'); 
       // if book successfully saves to user's account, save book id to state
       setBookList([...bookList, bookToSave.bookId]);
    } catch (err) {
      // log error
      console.error("Try/Catch Error: " + err);
      // log mutation error
      console.error("Mutation error: " + error);
    }
  }

  return (
    <>
      <div className='hero pt-5'>
        <Container>
          <Typography variant="h3">Search for Books!</Typography>
          <FormControl>
            <TextField 
              id='filled-basic' 
              label='Search' 
              variant='filled' 
              name='searchInput'
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              type='text'
              size='lg'
              placeholder='Search for a book'
            />
            <Button onClick={handleFormSubmit} disabled={!searchInput}>
              Submit
            </Button>
          </FormControl>


          {/* <Form onSubmit={handleFormSubmit}>
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
          </Form> */}
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
                        disabled={bookList?.some((savedBookId) => savedBookId === book.bookId)}
                        className='btn-block btn-info'
                        onClick={() => handleSaveBook(book.bookId)}>
                        {bookList?.some((savedBookId) => savedBookId === book.bookId)
                          ? 'Already saved!'
                          : 'Save'}
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
