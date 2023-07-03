# Book Search Engine

## Description

The Book Search Engine is a web application that demonstrates the importance of data and user demands in modern website development. It refactors a Google Books API search engine from a RESTful API to a GraphQL API using Apollo Server, showcasing adaptability. Built with the MERN stack, it enables users to search for books with optimal performance and offers the ability to save book searches, catering to personalized user experiences.

  ## Table of Contents
  * [Technology Stack](#technology-stack)
  * [User Story](#user-story)
  * [Acceptance Criteria](#acceptance-criteria)
  * [Installation](#installation)
  * [Screenshot](#screenshot)
  * [Deployed Page](#deployed-page)
  * [License](#license)
  * [Questions](#questions)


## Technology Stack

![html](https://img.shields.io/badge/-HTML5-61DAFB?color=red&style=flat)
![css](https://img.shields.io/badge/-CSS-61DAFB?color=orange&style=flat)
![javascript](https://img.shields.io/badge/-JavaScript-61DAFB?color=yellow&style=flat)
![node](https://img.shields.io/badge/-Node.js-61DAFB?color=green&style=flat)
![express](https://img.shields.io/badge/-Express.js-61DAFB?color=blue&style=flat)
![mongodb](https://img.shields.io/badge/-MongoDB-61DAFB?color=purple&style=flat)
![react](https://img.shields.io/badge/-React-61DAFB?color=red&style=flat)
![graphql](https://img.shields.io/badge/-GraphQL-61DAFB?color=red&style=flat)
![Apollo](https://img.shields.io/badge/-Apollo-61DAFB?color=red&style=flat)

## User Story

```md
AS AN avid reader
I WANT to search for new books to read
SO THAT I can keep a list of books to purchase
```

## Acceptance Criteria

```md
GIVEN a book search engine
WHEN I load the search engine
THEN I am presented with a menu with the options Search for Books  
and Login/Signup and an input field to search for books and a  
submit button
WHEN I click on the Search for Books menu option
THEN I am presented with an input field to search for books and a  
submit button
WHEN I am not logged in and enter a search term in the input field  
and click the submit button
THEN I am presented with several search results, each featuring a  
book’s title, author, description, image, and a link to that book  
on the Google Books site
WHEN I click on the Login/Signup menu option
THEN a modal appears on the screen with a toggle between the option  
to log in or sign up
WHEN the toggle is set to Signup
THEN I am presented with three inputs for a username, an email address,  
and a password, and a signup button
WHEN the toggle is set to Login
THEN I am presented with two inputs for an email address and a password  
and login button
WHEN I enter a valid email address and create a password and click on  
the signup button
THEN my user account is created and I am logged in to the site
WHEN I enter my account’s email address and password and click on the  
login button
THEN the modal closes and I am logged in to the site
WHEN I am logged in to the site
THEN the menu options change to Search for Books, an option to see my  
saved books, and Logout
WHEN I am logged in and enter a search term in the input field and click 
 the submit button
THEN I am presented with several search results, each featuring a book’s 
 title, author, description, image, and a link to that book on the Google 
  Books site and a button to save a book to my account
WHEN I click on the Save button on a book
THEN that book’s information is saved to my account
WHEN I click on the option to see my saved books
THEN I am presented with all of the books I have saved to my account, each 
 featuring the book’s title, author, description, image, and a link to that 
  book on the Google Books site and a button to remove a book from my account
WHEN I click on the Remove button on a book
THEN that book is deleted from my saved books list
WHEN I click on the Logout button
THEN I am logged out of the site and presented with a menu with the options 
 Search for Books and Login/Signup and an input field to search for books and  
 a submit button  
```

## Installation
  * Ensure you are running Node.js v16.  
  * Clone the repository.
  ```
    git clone git@github.com:erin-m-keller/keller-book-search.git
  ```
  * Install the dependencies.
  ```bash
    npm i 
  ```
  * Start the application.
  ```md
    npm start
  ```
  > Application is available at: http://localhost:3000/  
  > GraphQL is available at: http://localhost:3001/graphql

## Screenshot

// TODO: add screenshot

## Deployed page

// TODO: add heroku link

## License

[![MIT license](https://img.shields.io/badge/License-MIT-purple.svg)](https://lbesson.mit-license.org/)

## Questions

If you have any questions about this project, please contact me directly at [aestheticartist@gmail.com](aestheticartist@gmail.com).  
You can view more of my projects [here](https://github.com/erin-m-keller).