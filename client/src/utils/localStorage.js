// retrieve the saved book IDs from localStorage or 
// initialize with an empty array if it does not exist
export const getSavedBookIds = () => JSON.parse(localStorage.getItem('bookList') || '[]');

// save the provided book ID array to localStorage as 'bookList', 
// or remove the item if the array is empty
export const saveBookIds = (bookIdArr) =>
  bookIdArr.length
    ? localStorage.setItem('bookList', JSON.stringify(bookIdArr))
    : localStorage.removeItem('bookList');

// remove the specified book ID from the saved book IDs in localStorage
export const removeBookId = (bookId) => {
  // retrieve the saved book IDs from localStorage or initialize as null if it does not exist
  const savedBookIds = JSON.parse(localStorage.getItem('bookList') || 'null');
  // if savedBookIds is null, return false
  if (!savedBookIds) return false;
  // filter out the specified book ID from the saved book IDs array
  const updatedSavedBookIds = savedBookIds.filter((savedBookId) => savedBookId !== bookId);
  // save the updated saved book IDs array to localStorage as 'bookList'
  localStorage.setItem('bookList', JSON.stringify(updatedSavedBookIds));
  // return true to indicate successful removal
  return true;
};