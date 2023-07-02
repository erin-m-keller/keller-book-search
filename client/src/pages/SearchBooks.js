import React, { useState, useEffect } from 'react';
import { SAVE_BOOK } from '../utils/mutations.js';
import { useMutation } from "@apollo/client";
import Auth from '../utils/auth';
import { searchGoogleBooks } from '../utils/API';
import { saveBookList, getBookList } from '../utils/localStorage';
import { Alert } from 'react-bootstrap';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  FormControl,
  Snackbar,
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
        [bookList, setBookList] = useState(getBookList()),
        [showSnack, setShowSnack] = useState(false);

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
       setShowSnack(true);
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
        <div className="container">
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
        </div>
      </div>
      <div className="container">
        <h2 className='pt-5'>
          {searchedBooks.length
            ? `Viewing ${searchedBooks.length} results:`
            : 'Search for a book to begin'}
        </h2>
        <div className='card-wrapper'>
          {searchedBooks.map((book) => {
            return (
              <Card sx={{ maxWidth: 345 }} className='card-wrapper-item'>
                <CardMedia
                  sx={{ height: 140 }}
                  image={book.image}
                  title={`The cover for ${book.title}`}
                />
                <img src={book.image} alt={`The cover for ${book.title}`} className='book-cover' />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {book.title}
                  </Typography>
                  <p className='small'>Authors: {book.authors}</p>
                  <Typography variant="body2" color="text.secondary">
                    {book.description}
                  </Typography>
                </CardContent>
                <CardActions>
                {Auth.loggedIn() && bookList?.some((savedBookId) => savedBookId === book.bookId) ? (
                  <Alert variant="filled" severity="error">
                    Already saved!
                  </Alert>
                ) : (
                  <Button
                    size="small"
                    disabled={bookList?.some((savedBookId) => savedBookId === book.bookId)}
                    className="btn-block btn-info"
                    onClick={() => handleSaveBook(book.bookId)}
                  >
                    Save
                  </Button>
                )}
              </CardActions>
            </Card>
            );
          })}
        </div>
      </div>
      <Snackbar
        open={showSnack}
        autoHideDuration={6000}
        onClose={() => setShowSnack(false)}
        message="Book saved to list!"
      />
    </>
  );
};

export default SearchBooks;
