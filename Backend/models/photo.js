const mongoose = require('mongoose');

const photoSchema = new mongoose.Schema({
  photoId: Number,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  filePath: String,
  date: String,
});

module.exports = mongoose.model('Photo', photoSchema);
