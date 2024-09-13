const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  date: {
    type: String, 
    required: true,
  },
  details: {
    type: String,
    required: true,
  },
  time: {
    type: String, // Optional field to store time of the appointment
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed'],
    default: 'pending', // Default status
  },
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true,
  },
  validated: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model('Appointment', appointmentSchema);
