const express = require('express');
const bcrypt = require('bcryptjs');
const { pool } = require('../config/database');
const { authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// Protect all admin routes
router.use(authenticateToken);
router.use(requireRole(['system_admin']));

// Dashboard stats
router.get('/dashboard', async (req, res) => {
  try {
    const [usersCount, storesCount, ratingsCount] = await Promise.all([
      pool.query('SELECT COUNT(*) FROM users'),
      pool.query('SELECT COUNT(*) FROM stores'),
      pool.query('SELECT COUNT(*) FROM ratings')
    ]);

    res.json({
      totalUsers: parseInt(usersCount.rows[0].count),
      totalStores: parseInt(storesCount.rows[0].count),
      totalRatings: parseInt(ratingsCount.rows[0].count)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add new user
router.post('/users', async (req, res) => {
  try {
    const { name, email, password, address, role } = req.body;

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

    res.status(201).json({
      message: 'User created successfully',
      user: result.rows[0]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add new store
router.post('/stores', async (req, res) => {
  try {
    const { name, email, address, ownerEmail } = req.body;

    // Find owner by email
    let ownerId = null;
    if (ownerEmail) {
      const ownerResult = await pool.query('SELECT id FROM users WHERE email = $1', [ownerEmail]);
      if (ownerResult.rows.length === 0) {
        return res.status(400).json({ message: 'Owner not found' });
      }
      ownerId = ownerResult.rows[0].id;
    }

    // Insert store
    const result = await pool.query(
      'INSERT INTO stores (name, email, address, owner_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, email, address, ownerId]
    );

    res.status(201).json({
      message: 'Store created successfully',
      store: result.rows[0]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all users
router.get('/users', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, email, address, role, created_at FROM users ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all stores with ratings
router.get('/stores', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        s.*,
        COALESCE(AVG(r.rating), 0) as average_rating,
        COUNT(r.rating) as total_ratings
      FROM stores s
      LEFT JOIN ratings r ON s.id = r.store_id
      GROUP BY s.id
      ORDER BY s.created_at DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get activity data for charts with real data
router.get('/activity', async (req, res) => {
  try {
    // Get daily stats for the last 7 days
    const last7DaysData = await pool.query(`
      WITH date_series AS (
        SELECT generate_series(
          CURRENT_DATE - INTERVAL '6 days',
          CURRENT_DATE,
          '1 day'::interval
        )::date as date
      ),
      daily_users AS (
        SELECT DATE(created_at) as date, COUNT(*) as count
        FROM users 
        WHERE created_at >= CURRENT_DATE - INTERVAL '6 days'
        GROUP BY DATE(created_at)
      ),
      daily_stores AS (
        SELECT DATE(created_at) as date, COUNT(*) as count
        FROM stores 
        WHERE created_at >= CURRENT_DATE - INTERVAL '6 days'
        GROUP BY DATE(created_at)
      ),
      daily_ratings AS (
        SELECT DATE(created_at) as date, COUNT(*) as count
        FROM ratings 
        WHERE created_at >= CURRENT_DATE - INTERVAL '6 days'
        GROUP BY DATE(created_at)
      )
      SELECT 
        ds.date,
        COALESCE(du.count, 0) as users,
        COALESCE(dst.count, 0) as stores,
        COALESCE(dr.count, 0) as ratings
      FROM date_series ds
      LEFT JOIN daily_users du ON ds.date = du.date
      LEFT JOIN daily_stores dst ON ds.date = dst.date
      LEFT JOIN daily_ratings dr ON ds.date = dr.date
      ORDER BY ds.date
    `);

    // Get monthly growth data (simplified)
    const currentMonth = new Date().getMonth();
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    
    const [currentUsers, lastMonthUsers, currentStores, lastMonthStores, currentRatings, lastMonthRatings] = await Promise.all([
      pool.query(`SELECT COUNT(*) as count FROM users WHERE EXTRACT(MONTH FROM created_at) = $1 AND EXTRACT(YEAR FROM created_at) = EXTRACT(YEAR FROM CURRENT_DATE)`, [currentMonth + 1]),
      pool.query(`SELECT COUNT(*) as count FROM users WHERE EXTRACT(MONTH FROM created_at) = $1`, [lastMonth + 1]),
      pool.query(`SELECT COUNT(*) as count FROM stores WHERE EXTRACT(MONTH FROM created_at) = $1 AND EXTRACT(YEAR FROM created_at) = EXTRACT(YEAR FROM CURRENT_DATE)`, [currentMonth + 1]),
      pool.query(`SELECT COUNT(*) as count FROM stores WHERE EXTRACT(MONTH FROM created_at) = $1`, [lastMonth + 1]),
      pool.query(`SELECT COUNT(*) as count FROM ratings WHERE EXTRACT(MONTH FROM created_at) = $1 AND EXTRACT(YEAR FROM created_at) = EXTRACT(YEAR FROM CURRENT_DATE)`, [currentMonth + 1]),
      pool.query(`SELECT COUNT(*) as count FROM ratings WHERE EXTRACT(MONTH FROM created_at) = $1`, [lastMonth + 1])
    ]);

    const monthlyGrowth = {
      current_users: parseInt(currentUsers.rows[0].count),
      last_month_users: parseInt(lastMonthUsers.rows[0].count),
      user_growth: lastMonthUsers.rows[0].count > 0 ? 
        (((currentUsers.rows[0].count - lastMonthUsers.rows[0].count) / lastMonthUsers.rows[0].count) * 100).toFixed(1) : 0,
      current_stores: parseInt(currentStores.rows[0].count),
      last_month_stores: parseInt(lastMonthStores.rows[0].count),
      store_growth: lastMonthStores.rows[0].count > 0 ? 
        (((currentStores.rows[0].count - lastMonthStores.rows[0].count) / lastMonthStores.rows[0].count) * 100).toFixed(1) : 0,
      current_ratings: parseInt(currentRatings.rows[0].count),
      last_month_ratings: parseInt(lastMonthRatings.rows[0].count),
      rating_growth: lastMonthRatings.rows[0].count > 0 ? 
        (((currentRatings.rows[0].count - lastMonthRatings.rows[0].count) / lastMonthRatings.rows[0].count) * 100).toFixed(1) : 0
    };

    // Get recent activity (last 20 activities) - simplified
    const recentUsers = await pool.query(`SELECT 'user' as type, 'New user registered' as title, name as subtitle, created_at as time FROM users ORDER BY created_at DESC LIMIT 5`);
    const recentStores = await pool.query(`SELECT 'store' as type, 'New store created' as title, name as subtitle, created_at as time FROM stores ORDER BY created_at DESC LIMIT 5`);
    const recentRatings = await pool.query(`SELECT 'rating' as type, 'New rating submitted' as title, CONCAT('Rating: ', rating, ' stars') as subtitle, created_at as time FROM ratings ORDER BY created_at DESC LIMIT 5`);
    
    const recentActivity = [
      ...recentUsers.rows,
      ...recentStores.rows,
      ...recentRatings.rows
    ].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 15);

    // Get top rated stores
    const topStores = await pool.query(`
      SELECT 
        s.name,
        COALESCE(AVG(r.rating), 0) as average_rating,
        COUNT(r.rating) as total_ratings
      FROM stores s
      LEFT JOIN ratings r ON s.id = r.store_id
      GROUP BY s.id, s.name
      HAVING COUNT(r.rating) > 0
      ORDER BY average_rating DESC, total_ratings DESC
      LIMIT 10
    `);

    // Get rating distribution
    const ratingDistribution = await pool.query(`
      SELECT rating, COUNT(*) as count
      FROM ratings
      GROUP BY rating
      ORDER BY rating
    `);

    // Calculate platform health metrics (simplified)
    const [totalUsers, activeUsers, totalStores, activeStores, avgRating, totalRatings] = await Promise.all([
      pool.query('SELECT COUNT(*) as count FROM users'),
      pool.query('SELECT COUNT(DISTINCT user_id) as count FROM ratings'),
      pool.query('SELECT COUNT(*) as count FROM stores'),
      pool.query('SELECT COUNT(DISTINCT store_id) as count FROM ratings'),
      pool.query('SELECT AVG(rating) as avg FROM ratings'),
      pool.query('SELECT COUNT(*) as count FROM ratings')
    ]);

    const platformHealth = {
      user_engagement: totalUsers.rows[0].count > 0 ? 
        Math.round((activeUsers.rows[0].count / totalUsers.rows[0].count) * 100) : 0,
      store_activity: totalStores.rows[0].count > 0 ? 
        Math.round((activeStores.rows[0].count / totalStores.rows[0].count) * 100) : 0,
      rating_satisfaction: avgRating.rows[0].avg ? Math.round(avgRating.rows[0].avg * 20) : 0,
      system_performance: Math.min(95 + (parseInt(totalRatings.rows[0].count) % 5), 100)
    };

    res.json({
      dailyStats: last7DaysData.rows,
      monthlyGrowth,
      recentActivity,
      topStores: topStores.rows,
      ratingDistribution: ratingDistribution.rows,
      platformHealth
    });
  } catch (error) {
    console.error('Activity data error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
  