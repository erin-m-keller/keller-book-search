// initialize variables
const jwt = require("jsonwebtoken"),
      secret = process.env.SECRET,
      expiration = "5h";

module.exports = {
  // function to sign a token with the provided payload, secret, and expiration
  generateAuthToken: ({ username, email, _id }) => 
    jwt.sign({ data: { username, email, _id } }, process.env.SECRET_KEY, { expiresIn: expiration }), 
  // function to extract and verify a token from the request, assigning the decoded 
  // user data to the req.user property if the token is valid
  authMiddleware: ({ req }) => {
    // initialize variables
    let token = req.body.token || req.query.token || req.headers.authorization;
    // extract the token from the authorization header if present
    if (req.headers.authorization) token = token.split(" ").pop().trim();
    // if token is not found, return the request object as is 
    if (!token) return req; 
    try {
      // verify and decode the token, and assign the decoded data to the 'user' property of the request object
      req.user = jwt.verify(token, secret, { maxAge: expiration }).data; 
    } catch {
      // log an error message if the token is invalid
      console.log("Token is invalid."); 
    }
    // return the request object
    return req; 
  },
};