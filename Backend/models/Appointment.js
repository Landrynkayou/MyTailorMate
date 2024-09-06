const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  aptId: Number,
  time: String,
  status: String,
  date: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

module.exports = mongoose.model('Appointment', appointmentSchema);
