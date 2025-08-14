const express = require('express');
const { pool } = require('../config/database');
const { authenticateToken, requireStoreOwner } = require('../middleware/auth');

const router = express.Router();

// Protect all store routes
router.use(authenticateToken);
router.use(requireStoreOwner);

// Get store owner's stores
router.get('/my-stores', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        s.*,
        COALESCE(AVG(r.rating), 0) as average_rating,
        COUNT(r.rating) as total_ratings
      FROM stores s
      LEFT JOIN ratings r ON s.id = r.store_id
      WHERE s.owner_id = $1
      GROUP BY s.id
      ORDER BY s.created_at DESC
    `, [req.user.id]);
    
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get ratings for a specific store
router.get('/:storeId/ratings', async (req, res) => {
  try {
    const { storeId } = req.params;
    
    // Verify store ownership
    const storeCheck = await pool.query(
      'SELECT * FROM stores WHERE id = $1 AND owner_id = $2',
      [storeId, req.user.id]
    );
    
    if (storeCheck.rows.length === 0) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const result = await pool.query(`
      SELECT r.*, u.name as user_name
      FROM ratings r
      JOIN users u ON r.user_id = u.id
      WHERE r.store_id = $1
      ORDER BY r.created_at DESC
    `, [storeId]);
    
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
