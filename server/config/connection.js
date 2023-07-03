// initialize variables
const mongoose = require('mongoose');

// connect to the MongoDB database using the provided URI,
// or use a default URI 'mongodb://127.0.0.1:27017/googlebooks'
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/googlebooks', { useNewUrlParser: true })
        .then(connect => console.log('connected to mongodb..'))
        .catch(e => console.log('could not connect to mongodb', e));



        // mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/googlebooks', { useNewUrlParser: true })
        // .then(connect => console.log('connected to mongodb..'))
        // .catch(e => console.log('could not connect to mongodb', e))

// export the mongoose connection object
module.exports = mongoose.connection;
