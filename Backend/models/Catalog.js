const mongoose = require('mongoose');

const catalogSchema = new mongoose.Schema({
  catalogId: Number,
  items: String,
  createdAt: Date,
  updatedAt: Date,
  category: String,
});

module.exports = mongoose.model('Catalog', catalogSchema);
