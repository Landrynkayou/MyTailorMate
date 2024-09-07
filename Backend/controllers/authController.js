const User = require('../models/Users');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET; // Replace with your secret key

// Login Function
exports.login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const user = await User.findOne({ email, role });

    if (!user) return res.status(400).json({ message: 'Invalid email, password, or role' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });

    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Signup Function (this could be called by client, tailor, or admin)
exports.signup = async (req, res) => {
    try {
      const { fullName, email, phone, password, role, businessName, address } = req.body;
  
      // Check if the user already exists with the same email and role
      const existingUser = await User.findOne({ email, role });
      if (existingUser) return res.status(400).json({ message: 'User already exists' });
  
      // Create a new user object with required fields
      const userData = {
        fullName,
        email,
        phone,
        password,
        role
      };
  
      // Add businessName and address if the role is 'Tailor'
      if (role === 'Tailor') {
        userData.businessName = businessName;
        userData.address = address;
      }
  
      // Create and save the user
      const user = new User(userData);
      await user.save();
  
      // Generate JWT token
      const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
  
      // Send response
      res.status(201).json({ token, user });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
