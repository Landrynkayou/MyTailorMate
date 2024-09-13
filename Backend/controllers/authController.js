const User = require('../models/Users');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const sendEmail = require('../utils/sendEmail');
const Tailor = require('../models/tailor');
const JWT_SECRET = process.env.JWT_TOKEN_KEY; // Replace with your secret key

// Login Function
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    // Check if the provided password matches the user's stored password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    // Generate a JWT token
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '2h' });

    // Send back the token and user data (excluding sensitive information)
    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Signup Function (handles clients, tailors, and admins)
exports.signup = async (req, res) => {
    try {
      const { fullName, email, phone, password, role, businessName, address, location } = req.body;
  
      // Check if the user already exists with the same email and role
      const existingUser = await User.findOne({ email, role });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }
  
      // Create a new user object with required fields
      const userData = {
        fullName,
        email,
        phone,
        password: await bcrypt.hash(password, 12), // Hash the password
        role,
        location, // Include location in user data
      };
  
      // Add businessName and address if the role is 'Tailor'
      if (role === 'Tailor') {
        userData.businessName = businessName;
        userData.address = address;
      }
  
      // Create and save the user
      const user = new User(userData);
      await user.save();
  
      if (role === 'Tailor') {
        const tailorData = {
          userID: user._id,
          fullName: user.fullName,
          businessName,
          address,
          location, // Include location in tailor data
        };
  
        const tailor = new Tailor(tailorData);
        await tailor.save();
      }
  
      // Generate JWT token
      const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
  
      // Send response
      res.status(201).json({
        token,
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
          fullName: user.fullName,
          phone: user.phone,
          businessName: user.businessName,
          address: user.address,
          location: user.location, // Include location in the response
        },
      });
    } catch (error) {
      console.error('Signup Error:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };

// Forgot Password Function
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'No user found with this email address' });
    }

    // Generate a reset token
    const resetToken = crypto.randomBytes(32).toString('hex');

    // Hash the token and set it on the user along with an expiration time
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpire = Date.now() + 30 * 60 * 1000; // Token valid for 30 minutes

    await user.save();

    // Create reset URL
    const resetUrl = `http://192.168.1.190:8082/reset-password/${resetToken}`;

    // Email message
    const message = `
      You requested a password reset. Please make a PUT request to:
      ${resetUrl}
    `;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Password Reset Request',
        message,
      });

      res.status(200).json({ success: true, message: 'Email sent' });
    } catch (error) {
      // If email sending fails, clear the reset token and expiration time
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();
      console.error('Email Error:', error);
      return res.status(500).json({ message: 'Email could not be sent' });
    }
  } catch (error) {
    console.error('Forgot Password Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Reset Password Function
exports.resetPassword = async (req, res) => {
  try {
    // Hash the token sent in the URL
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    // Find the user by the token and ensure it hasn't expired
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    // Set the new password
    const { password } = req.body;
    user.password = await bcrypt.hash(password, 12); // Hash the new password
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({ success: true, message: 'Password reset successful' });
  } catch (error) {
    console.error('Reset Password Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
