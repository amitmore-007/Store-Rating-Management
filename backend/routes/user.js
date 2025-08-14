const express = require('express');
const { pool } = require('../config/database');
const { authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// Protect all user routes
router.use(authenticateToken);

// Get all stores for rating
router.get('/stores', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        s.*,
        COALESCE(AVG(r.rating), 0) as average_rating,
        COUNT(r.rating) as total_ratings,
        ur.rating as user_rating
      FROM stores s
      LEFT JOIN ratings r ON s.id = r.store_id
      LEFT JOIN ratings ur ON s.id = ur.store_id AND ur.user_id = $1
      GROUP BY s.id, ur.rating
      ORDER BY s.name
    `, [req.user.id]);
    
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Submit or update rating
router.post('/ratings', async (req, res) => {
  try {
    const { storeId, rating, comment } = req.body;
    const userId = req.user.id;

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    // Check if user already rated this store
    const existingRating = await pool.query(
      'SELECT * FROM ratings WHERE user_id = $1 AND store_id = $2',
      [userId, storeId]
    );

    let result;
    if (existingRating.rows.length > 0) {
      // Update existing rating
      result = await pool.query(
        'UPDATE ratings SET rating = $1, comment = $2 WHERE user_id = $3 AND store_id = $4 RETURNING *',
        [rating, comment, userId, storeId]
      );
    } else {
      // Insert new rating
      result = await pool.query(
        'INSERT INTO ratings (user_id, store_id, rating, comment) VALUES ($1, $2, $3, $4) RETURNING *',
        [userId, storeId, rating, comment]
      );
    }

    res.json({
      message: 'Rating submitted successfully',
      rating: result.rows[0]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's ratings
router.get('/my-ratings', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT r.*, s.name as store_name
      FROM ratings r
      JOIN stores s ON r.store_id = s.id
      WHERE r.user_id = $1
      ORDER BY r.created_at DESC
    `, [req.user.id]);
    
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
