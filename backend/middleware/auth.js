const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    
    // Get user from database
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [decoded.userId]);
    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = result.rows[0];
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(403).json({ message: 'Invalid token' });
  }
};

const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'system_admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

const requireStoreOwner = (req, res, next) => {
  if (req.user.role !== 'store_owner' && req.user.role !== 'system_admin') {
    return res.status(403).json({ message: 'Store owner access required' });
  }
  next();
};

module.exports = {
  authenticateToken,
  requireAdmin,
  requireStoreOwner
};
