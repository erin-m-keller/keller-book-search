// initialize variables
const { Schema } = require('mongoose');

// define the subdocument schema for a book
const bookSchema = new Schema({
  // rrray of authors, each author is of type String
  authors: [
    {
      type: String,
    },
  ],
  // description of the book, required field
  description: {
    type: String,
    required: true,
  },
  // unique book ID from Google Books, required field
  bookId: {
    type: String,
    required: true,
  },
  // URL of the book's image
  image: {
    type: String,
  },
  // URL of the book's external link
  link: {
    type: String,
  },
  // title of the book, required field
  title: {
    type: String,
    required: true,
  },
});

// export the book schema
module.exports = bookSchema;
