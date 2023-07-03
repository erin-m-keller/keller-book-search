// retrieve the saved book IDs from localStorage or 
// initialize with an empty array if it does not exist
export const getBookList = () => JSON.parse(localStorage.getItem('activeUserBookList') || '[]');

// save the provided book ID array to localStorage as 'activeUserBookList', 
// or remove the item if the array is empty
export const saveBookList = (bookIdArr) =>
  bookIdArr.length
    ? localStorage.setItem('activeUserBookList', JSON.stringify(bookIdArr))
    : localStorage.removeItem('activeUserBookList');

// remove the specified book ID from the saved book IDs in localStorage
export const removeBookFromList = (bookId) => {
  // retrieve the saved book IDs from localStorage
  const savedBookIds = JSON.parse(localStorage.getItem('activeUserBookList'));
  // if savedBookIds is null, return false
  if (!savedBookIds) return false;
  // filter out the specified book ID from the saved book IDs array
  const updatedSavedBookIds = savedBookIds.filter((savedBookId) => savedBookId !== bookId);
  // save the updated saved book IDs array to localStorage as 'activeUserBookList'
  localStorage.setItem('activeUserBookList', JSON.stringify(updatedSavedBookIds));
  // return true to indicate successful removal
  return true;
};