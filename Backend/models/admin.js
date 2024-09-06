const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const adminSchema = new Schema({
  userID: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  // Additional admin-specific fields if necessary
});

module.exports = mongoose.model('Admin', adminSchema);
