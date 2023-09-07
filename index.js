const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 6000;

// Serve static files from the React app build directory
app.use(express.static(path.join(__dirname, 'client/build')));

// Define API routes here
app.get('/api/hello', (req, res) => {
  res.json({ message: "Hello from server!" });
});

// Catch-all to serve React frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
