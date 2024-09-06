const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  ratingId: Number,
  comment: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

module.exports = mongoose.model('Ratings', ratingSchema);
