// initialize variables
const mongoose = require('mongoose');

// connect to the MongoDB database using the provided URI,
// or use a default URI 'mongodb://127.0.0.1:27017/googlebooks'
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/googlebooks');

// export the mongoose connection object
module.exports = mongoose.connection;
