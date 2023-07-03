import React, { useState, useEffect } from 'react';
import { SAVE_BOOK } from '../utils/mutations.js';
import { useMutation } from "@apollo/client";
import Auth from '../utils/auth';
import { searchGoogleBooks } from '../utils/API';
import { saveBookList, getBookList } from '../utils/localStorage';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp, faBookmark as faBookmarkFilled, faBook } from '@fortawesome/free-solid-svg-icons';
import { faBookmark } from '@fortawesome/free-regular-svg-icons';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Collapse,
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
        [showSnack, setShowSnack] = useState(false),
        [expandedCardId, setExpandedCardId] = useState(null);

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

  // handles card expand/collapse
  const handleCardExpand = (bookId) => {
    // update the expandedCardId state based on the clicked bookId
    setExpandedCardId((prevCardId) => (prevCardId === bookId ? null : bookId));
  };

  return (
    <>
      <div className='hero pt-5'>
        <div className="container p-4">
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
              size='medium'
              placeholder='Search for a book'
            />
            <Button onClick={handleFormSubmit} disabled={!searchInput}>
              Submit
            </Button>
          </FormControl>
          <FontAwesomeIcon icon={faBook} aria-label="A book" size="6x" className="hero-book" />
        </div>
      </div>
      <div className="container p-4">
        <h2 className='pt-5'>
          {searchedBooks.length
            ? `Viewing ${searchedBooks.length} results:`
            : 'Search for a book to begin'}
        </h2>
        <div className='card-wrapper'>
          {searchedBooks.map((book) => {
            const isCardExpanded = expandedCardId === book.bookId;
            return (
              <Card sx={{ maxWidth: 345 }} className='card-wrapper-item' key={book.bookId}>
                {book.image ? <img src={book.image} alt={`The cover for ${book.title}`} className='book-cover' /> : null}
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {book.title}
                  </Typography>
                  <Typography paragraph className='small'>Authors: {book.authors}</Typography>
                </CardContent>
                <CardActions>
                {Auth.loggedIn() && bookList?.some((savedBookId) => savedBookId === book.bookId) ? (
                  <>
                    <FontAwesomeIcon 
                      icon={faBookmarkFilled} 
                      aria-label={`${book.title} is saved`} 
                      className="bookmark" />&nbsp;&nbsp;&nbsp;<strong>Saved!</strong>
                  </>
                ) : (
                  <span className='card-icon-bookmark-btn' onClick={() => handleSaveBook(book.bookId)}>
                    <FontAwesomeIcon 
                      icon={faBookmark} 
                      aria-label={`${book.title} is saved`} 
                      className="bookmark" />&nbsp;&nbsp;&nbsp;<strong>Save</strong>
                  </span>
                )}
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
