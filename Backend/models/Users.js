const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Import bcrypt

const userSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['Customer', 'Tailor', 'Admin'], // Added Admin role
    required: true
  },
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  businessName: {
    type: String,
    required: function() { return this.role === 'Tailor'; }
  },
  address: {
    type: String,
    required: function() { return this.role === 'Tailor'; }
  },
  location: {
    type: String, // Changed to string for simplicity
    required: function() { return this.role === 'Tailor'; } // Make location required only for Tailors
  },
    resetPasswordToken: String,
  resetPasswordExpire: Date,
  
  
});

userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

userSchema.methods.comparePassword = function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User= mongoose.model('User', userSchema);
module.exports= User;