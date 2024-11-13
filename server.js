const express = require('express');
const path = require('path'); // Import the path module
const app = express();

const PORT = process.env.PORT || 3000;

// Serve static files from the React build directory
app.use(express.static(path.join(__dirname, 'build')));

// Root route can serve a test message
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// For any other routes, serve the React app
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
