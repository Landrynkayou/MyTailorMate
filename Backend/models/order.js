const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderId: Number,
  items: String,
  status: String,
  createdAt: Date,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

module.exports = mongoose.model('Order', orderSchema);
