const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  notificationId: Number,
  received: Number,
  type: String,
  message: String,
  date: Date,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

module.exports = mongoose.model('Notification', notificationSchema);
