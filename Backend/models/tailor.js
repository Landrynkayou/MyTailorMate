const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tailorSchema = new Schema({
  userID: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  businessName: { type: String, required: true },
  address: { type: String, required: true },
  fullName: { type: String, required: true },
  password: { type: String, required: true },
  location: { 
    type: String,
    required: true 
  }
});

module.exports = mongoose.model('Tailor', tailorSchema);
