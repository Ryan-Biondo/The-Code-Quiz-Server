// Import the express library, for building the server
const express = require('express');

// Import the CORS library, to handle cross-origin requests
const cors = require('cors');

// Import the path library, to handle file paths
const path = require('path');

// Import the fs library, to handle file system operations
const fs = require('fs');

// Create an instance of an express application
const app = express();

// Throttling with express-rate-limit
const rateLimit = require('express-rate-limit');

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});

// Apply the rate limiting middleware to API endpoints
app.use('/data/', apiLimiter);
// Use CORS middleware on the application, to allow cross-origin requests
app.use(cors());

// Handle GET requests to '/api/:category/:difficulty'
app.get('/api/:category/:difficulty', (req, res) => {
  // Extract category and difficulty from the request parameters
  const { category, difficulty } = req.params;

  // Construct a file path to the data file
  const dataFilePath = path.join(
    __dirname,
    'data',
    category,
    `${difficulty}.json`
  );

  // Read the data file asynchronously
  fs.readFile(dataFilePath, 'utf8', (err, data) => {
    // If an error occurred, log it and send a 500 response
    if (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
    // If no error occurred, parse the data and send it
    else {
      res.json(JSON.parse(data));
    }
  });
});

var port = process.env.PORT || 3000; // Use the port that the host provides or fall back to 3000
app.listen(port, function () {
  console.log('Express server listening on port %d', port);
});
