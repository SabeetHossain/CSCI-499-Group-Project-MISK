const express = require('express');

const app = express();

//route handler
app.get('/', (req, res) => {
  res.send('This is the MISK server.');
});

//start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
