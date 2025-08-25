const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Register user
const register = async (req, res) => {
  try {
    const { name, email, password, username, firstName, lastName, department, role } = req.body;
    
    // Handle both frontend formats: 'name' (full name) or individual 'firstName'/'lastName'
    let finalFirstName, finalLastName, finalUsername;
    
    if (name && !firstName && !lastName) {
      // Frontend sends 'name' (full name) - split it
      const nameParts = name.trim().split(' ');
      finalFirstName = nameParts[0] || '';
      finalLastName = nameParts.slice(1).join(' ') || '';
      finalUsername = email.split('@')[0]; // Use email prefix as username
    } else {
      // Backend sends individual fields
      finalFirstName = firstName || '';
      finalLastName = lastName || '';
      finalUsername = username || email.split('@')[0];
    }
    
    // Set default department if not provided
    const finalDepartment = department || 'General';
    
    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username: finalUsername }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const user = new User({
      username: finalUsername,
      email,
      password: hashedPassword,
      firstName: finalFirstName,
      lastName: finalLastName,
      department: finalDepartment,
      role: role || 'hr_staff'
    });
    
    await user.save();
    
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Check password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Update last login
    user.lastLogin = new Date();
    await user.save();
    
    // Generate token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        department: user.department
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error. Please try again.' });
  }
};

module.exports = { register, login }; 