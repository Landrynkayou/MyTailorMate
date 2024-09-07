const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./db'); // MongoDB connection
const routes = require('./routes/routes'); // Import the routes from route.js
const cors = require('cors');


// Load environment variables
dotenv.config();

// Connect to the database
connectDB();

// Initialize the app
const app = express();

// Middleware
app.use(express.json()); // For parsing JSON bodies

// Routes
app.use('/api', routes); // Prefix all routes with /api

// Middleware for enabling CORS (Cross-Origin Resource Sharing)
const enableCors = cors({
  origin: '*', // Allow all origins (adjust this for production security)
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});

app.use(enableCors);

// Default route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message });
});

// Set the port from environment or use 5000
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
