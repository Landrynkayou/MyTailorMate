const mongoose = require('mongoose');

const measurementsSchema = new mongoose.Schema({
  msrId: Number,
  height: Number,
  weight: Number,
  chestSize: Number,
  waistSize: Number,
  hipSize: Number,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

module.exports = mongoose.model('Measurements', measurementsSchema);
