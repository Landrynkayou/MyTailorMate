const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tailorSchema = new Schema({
  userID: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  
});

module.exports = mongoose.model('Tailor', tailorSchema);
