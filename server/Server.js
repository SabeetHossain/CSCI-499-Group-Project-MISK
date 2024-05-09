const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 3000;

// Define a route to make an API request
app.get('/search', (req, res) => {
  // Make a GET request to the Google Custom Search Engine API
  axios.get('https://cse.google.com/cse.js?cx=c1d57647cdea0430a', {
    params: {
      key: 'AIzaSyDXIG-4CXfivQ2giz4wpnPpPk4HahIfjjw', // Replace 'YOUR_API_KEY' with your actual API key
      cx: '3911450170-b8n9atsjoiigo6op44gviesnrgflmo5c.apps.googleusercontent.com', // Replace 'YOUR_SEARCH_ENGINE_ID' with your actual search engine ID
      q: req.query.q // The search query passed as a query parameter
    }
  })
  .then(response => {
    // Send the response data back to the client
    res.json(response.data);
  })
  .catch(error => {
    // Handle errors
    console.error('Error fetching search results:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
