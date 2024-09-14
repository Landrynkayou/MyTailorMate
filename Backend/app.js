const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./db'); // MongoDB connection
const routes = require('./routes/routes'); // Import the routes from route.js
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const http = require('http'); // Needed for Socket.io
const socketIO = require('socket.io'); // Import Socket.io

// Load environment variables
dotenv.config();

// Connect to the database
connectDB();

// Initialize the app
const app = express();
const server = http.createServer(app); // Create HTTP server using express app
const io = socketIO(server); // Initialize Socket.io with the server


// Middleware
app.use(express.json()); // For parsing JSON bodies
app.use(cors({ // Enable CORS
  origin: '*', // Allow all origins (adjust this for production security)
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static('uploads'));


// Socket.io connection handling
io.on('connection', (socket) => {
  console.log(`New client connected: ${socket.id}`);

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });

  // Example event - This is where you can add custom events
  socket.on('exampleEvent', (data) => {
    console.log(`Received exampleEvent with data: ${data}`);
    io.emit('exampleResponse', 'Response from the server'); // Emitting a response event
  });
});

// Attach Socket.io instance to the request object so it can be used in routes/controllers
app.use((req, res, next) => {
  req.io = io;
  next();
});



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
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
