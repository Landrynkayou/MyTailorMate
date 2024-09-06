const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String,
  profilePhoto: String,
  tel: Number,
});

module.exports = mongoose.model('User', userSchema);
