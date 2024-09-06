const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  messageId: Number,
  chatId: Number,
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  content: String,
});

module.exports = mongoose.model('Message', messageSchema);
