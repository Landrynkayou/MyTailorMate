const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const clientSchema = new Schema({
  userID: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  // Additional client-specific fields if necessary
});

module.exports = mongoose.model('Client', clientSchema);
