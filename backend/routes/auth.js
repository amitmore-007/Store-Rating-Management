const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Validation functions
const validateName = (name) => {
  if (!name || name.length < 3) return 'Name must be at least 3 characters'
  if (name.length > 60) return 'Name cannot exceed 60 characters'
  return null
}

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) return 'Please enter a valid email address'
  return null
}

const validatePassword = (password) => {
  if (!password || password.length < 8) return 'Password must be at least 8 characters'
  if (password.length > 16) return 'Password cannot exceed 16 characters'
  if (!/[A-Z]/.test(password)) return 'Password must include at least one uppercase letter'
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return 'Password must include at least one special character'
  return null
}

const validateAddress = (address) => {
  if (address && address.length > 400) return 'Address cannot exceed 400 characters'
  return null
}

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, address, role } = req.body;

    // Backend validation
    const nameError = validateName(name)
    if (nameError) return res.status(400).json({ message: nameError })

    const emailError = validateEmail(email)
    if (emailError) return res.status(400).json({ message: emailError })

    const passwordError = validatePassword(password)
    if (passwordError) return res.status(400).json({ message: passwordError })

    const addressError = validateAddress(address)
    if (addressError) return res.status(400).json({ message: addressError })

    // Check if user already exists
    const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const result = await pool.query(
      'INSERT INTO users (name, email, password, address, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, role, address, created_at',
      [name, email, hashedPassword, address, role || 'normal_user']
    );

    // Generate JWT token
    const token = jwt.sign(
      { userId: result.rows[0].id },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: result.rows[0]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = result.rows[0];

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '24h' }
    );

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      message: 'Login successful',
      token,
      user: userWithoutPassword
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get current user
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const { password: _, ...userWithoutPassword } = req.user;
    res.json({
      user: userWithoutPassword
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
