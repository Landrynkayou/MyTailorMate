// db.js
const mongoose = require('mongoose');
require('dotenv').config();
const { createAppointment } = require('./controllers/appointment'); // Import the controller

const connectDB = async () => {
  try {
    // Connect to MongoDB
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Example of creating a new appointment
    // In a real app, you'd use express routes to call createAppointment

  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;
