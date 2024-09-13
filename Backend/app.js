const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./db'); // MongoDB connection
const routes = require('./routes/routes'); // Import the routes from route.js
const cors = require('cors');
const multer = require('multer');
const path = require('path');

// Load environment variables
dotenv.config();

// Connect to the databaserou
connectDB();

// Initialize the app
const app = express();

/*
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Set the destination folder for uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Set file name with timestamp
  }
});

const upload = multer({ storage });
*/
// Middleware
app.use(express.json()); // For parsing JSON bodies
app.use(cors({ // Enable CORS
  origin: '*', // Allow all origins (adjust this for production security)
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Serve static files from the 'uploads' directory
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api', routes); // Prefix all routes with /api

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
