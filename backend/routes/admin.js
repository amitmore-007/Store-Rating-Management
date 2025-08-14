const express = require('express');
const bcrypt = require('bcryptjs');
const { pool } = require('../config/database');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Apply admin authentication to all routes
router.use(authenticateToken);
router.use(requireAdmin);

// Get dashboard stats
router.get('/dashboard', async (req, res) => {
  try {
    // Get total users
    const usersResult = await pool.query('SELECT COUNT(*) FROM users');
    const totalUsers = parseInt(usersResult.rows[0].count);

    // Get total stores
    const storesResult = await pool.query('SELECT COUNT(*) FROM stores');
    const totalStores = parseInt(storesResult.rows[0].count);

    // Get total ratings
    const ratingsResult = await pool.query('SELECT COUNT(*) FROM ratings');
    const totalRatings = parseInt(ratingsResult.rows[0].count);

    res.json({
      totalUsers,
      totalStores,
      totalRatings
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get activity data for dashboard
router.get('/dashboard/activity', async (req, res) => {
  try {
    // Get daily stats for the last 7 days including today
    const dailyStatsQuery = `
      WITH date_series AS (
        SELECT 
          CURRENT_DATE - INTERVAL '6 days' + INTERVAL '1 day' * generate_series(0, 6) as date
      ),
      user_counts AS (
        SELECT 
          DATE(created_at) as date, 
          COUNT(*) as count
        FROM users 
        WHERE created_at >= CURRENT_DATE - INTERVAL '6 days'
        GROUP BY DATE(created_at)
      ),
      store_counts AS (
        SELECT 
          DATE(created_at) as date, 
          COUNT(*) as count
        FROM stores 
        WHERE created_at >= CURRENT_DATE - INTERVAL '6 days'
        GROUP BY DATE(created_at)
      ),
      rating_counts AS (
        SELECT 
          DATE(created_at) as date, 
          COUNT(*) as count
        FROM ratings 
        WHERE created_at >= CURRENT_DATE - INTERVAL '6 days'
        GROUP BY DATE(created_at)
      )
      SELECT 
        ds.date,
        COALESCE(uc.count, 0) as users,
        COALESCE(sc.count, 0) as stores,
        COALESCE(rc.count, 0) as ratings
      FROM date_series ds
      LEFT JOIN user_counts uc ON ds.date = uc.date
      LEFT JOIN store_counts sc ON ds.date = sc.date
      LEFT JOIN rating_counts rc ON ds.date = rc.date
      ORDER BY ds.date
    `;
    
    const dailyResult = await pool.query(dailyStatsQuery);
    
    // Debug the raw SQL results
    console.log('Raw SQL results:', dailyResult.rows);
    const currentDateQuery = await pool.query('SELECT CURRENT_DATE');
    console.log('Current date from PostgreSQL:', currentDateQuery.rows[0]);
    
    // Process daily stats with proper date formatting
    const dailyStats = dailyResult.rows.map(row => {
      try {
        // Safely handle date conversion
        const dbDate = row.date ? new Date(row.date) : new Date();
        
        // Validate the date
        if (isNaN(dbDate.getTime())) {
          throw new Error('Invalid date');
        }
        
        const currentDate = new Date();
        
        // Format dates for comparison (YYYY-MM-DD)
        const dbDateStr = dbDate.toISOString().split('T')[0];
        const todayStr = currentDate.toISOString().split('T')[0];
        const yesterday = new Date(currentDate);
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];
        
        let dateLabel;
        let isToday = false;
        
        console.log(`Comparing: dbDateStr=${dbDateStr}, todayStr=${todayStr}, yesterdayStr=${yesterdayStr}`);
        
        if (dbDateStr === todayStr) {
          dateLabel = 'Today';
          isToday = true;
        } else if (dbDateStr === yesterdayStr) {
          dateLabel = 'Yesterday';
        } else {
          dateLabel = dbDate.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric' 
          });
        }
        
        return {
          date: dbDateStr,
          dateLabel,
          users: parseInt(row.users) || 0,
          stores: parseInt(row.stores) || 0,
          ratings: parseInt(row.ratings) || 0,
          isToday
        };
      } catch (dateError) {
        console.error('Date processing error for row:', row, dateError);
        // Return a fallback entry for invalid dates
        const fallbackDate = new Date().toISOString().split('T')[0];
        return {
          date: fallbackDate,
          dateLabel: 'Unknown',
          users: parseInt(row.users) || 0,
          stores: parseInt(row.stores) || 0,
          ratings: parseInt(row.ratings) || 0,
          isToday: false
        };
      }
    });

    // If today is missing, add it manually
    const todayStr = new Date().toISOString().split('T')[0];
    const hasToday = dailyStats.some(stat => stat.date === todayStr);
    
    if (!hasToday) {
      console.log('Today is missing, adding manually...');
      
      // Get today's data specifically
      const todayUserCount = await pool.query(`
        SELECT COUNT(*) as count FROM users 
        WHERE DATE(created_at) = CURRENT_DATE
      `);
      const todayStoreCount = await pool.query(`
        SELECT COUNT(*) as count FROM stores 
        WHERE DATE(created_at) = CURRENT_DATE
      `);
      const todayRatingCount = await pool.query(`
        SELECT COUNT(*) as count FROM ratings 
        WHERE DATE(created_at) = CURRENT_DATE
      `);
      
      const todayData = {
        date: todayStr,
        dateLabel: 'Today',
        users: parseInt(todayUserCount.rows[0].count) || 0,
        stores: parseInt(todayStoreCount.rows[0].count) || 0,
        ratings: parseInt(todayRatingCount.rows[0].count) || 0,
        isToday: true
      };
      
      // Remove the oldest entry and add today
      dailyStats.shift();
      dailyStats.push(todayData);
    }

    // Debug log to check dates
    console.log('Current server date:', new Date().toISOString());
    console.log('Daily stats processed:', dailyStats.map(d => ({ 
      date: d.date, 
      label: d.dateLabel, 
      isToday: d.isToday,
      users: d.users,
      stores: d.stores,
      ratings: d.ratings
    })));

    // Get monthly growth data
    const monthlyGrowthQuery = `
      SELECT 
        COUNT(CASE WHEN created_at >= date_trunc('month', CURRENT_DATE) THEN 1 END) as current_users,
        COUNT(CASE WHEN created_at >= date_trunc('month', CURRENT_DATE - INTERVAL '1 month') 
                    AND created_at < date_trunc('month', CURRENT_DATE) THEN 1 END) as previous_users
      FROM users;
    `;
    
    const growthResult = await pool.query(monthlyGrowthQuery);
    const userGrowth = growthResult.rows[0];
    
    const storeGrowthQuery = `
      SELECT 
        COUNT(CASE WHEN created_at >= date_trunc('month', CURRENT_DATE) THEN 1 END) as current_stores,
        COUNT(CASE WHEN created_at >= date_trunc('month', CURRENT_DATE - INTERVAL '1 month') 
                    AND created_at < date_trunc('month', CURRENT_DATE) THEN 1 END) as previous_stores
      FROM stores;
    `;
    
    const storeGrowthResult = await pool.query(storeGrowthQuery);
    const storeGrowth = storeGrowthResult.rows[0];

    // Calculate growth percentages
    const userGrowthPercent = userGrowth.previous_users > 0 
      ? ((userGrowth.current_users - userGrowth.previous_users) / userGrowth.previous_users * 100).toFixed(1)
      : 100;
      
    const storeGrowthPercent = storeGrowth.previous_stores > 0 
      ? ((storeGrowth.current_stores - storeGrowth.previous_stores) / storeGrowth.previous_stores * 100).toFixed(1)
      : 100;

    // Get recent activity
    const recentActivityQuery = `
      (SELECT 'user' as type, name as title, email as subtitle, created_at as time
       FROM users ORDER BY created_at DESC LIMIT 5)
      UNION ALL
      (SELECT 'store' as type, name as title, email as subtitle, created_at as time
       FROM stores ORDER BY created_at DESC LIMIT 5)
      UNION ALL
      (SELECT 'rating' as type, 
              CONCAT('Rating: ', rating, ' stars') as title, 
              CONCAT('Store ID: ', store_id) as subtitle, 
              created_at as time
       FROM ratings ORDER BY created_at DESC LIMIT 5)
      ORDER BY time DESC LIMIT 10
    `;
    
    const activityResult = await pool.query(recentActivityQuery);
    const recentActivity = activityResult.rows;

    // Platform health metrics (mock data for now)
    const platformHealth = {
      user_engagement: Math.floor(Math.random() * 20) + 80, // 80-100%
      store_activity: Math.floor(Math.random() * 15) + 75,  // 75-90%
      rating_satisfaction: Math.floor(Math.random() * 10) + 85, // 85-95%
      system_performance: Math.floor(Math.random() * 10) + 85   // 85-95%
    };

    res.json({
      dailyStats,
      monthlyGrowth: {
        current_users: parseInt(userGrowth.current_users),
        user_growth: userGrowthPercent,
        current_stores: parseInt(storeGrowth.current_stores),
        store_growth: storeGrowthPercent
      },
      recentActivity,
      platformHealth,
      serverTime: new Date().toISOString(),
      currentDate: new Date().toDateString()
    });
  } catch (error) {
    console.error('Activity data error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all users
router.get('/users', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, name, email, role, address, created_at 
      FROM users 
      ORDER BY created_at DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new user
router.post('/users', async (req, res) => {
  try {
    const { name, email, password, address, role } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    // Check if user already exists
    const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const result = await pool.query(
      'INSERT INTO users (name, email, password, address, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, role, address, created_at',
      [name, email, hashedPassword, address || null, role || 'normal_user']
    );

    res.status(201).json({
      message: 'User created successfully',
      user: result.rows[0]
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all stores
router.get('/stores', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        s.*,
        COALESCE(AVG(r.rating), 0) as average_rating,
        COUNT(r.id) as total_ratings,
        u.name as owner_name
      FROM stores s
      LEFT JOIN ratings r ON s.id = r.store_id
      LEFT JOIN users u ON s.owner_id = u.id
      GROUP BY s.id, u.name
      ORDER BY s.created_at DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Get stores error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new store
router.post('/stores', async (req, res) => {
  try {
    const { name, email, address, ownerEmail } = req.body;

    // Validation
    if (!name || !email) {
      return res.status(400).json({ message: 'Store name and email are required' });
    }

    // Check if store already exists
    const existingStore = await pool.query('SELECT * FROM stores WHERE email = $1', [email]);
    if (existingStore.rows.length > 0) {
      return res.status(400).json({ message: 'Store with this email already exists' });
    }

    let ownerId = null;

    // If owner email is provided, find the owner
    if (ownerEmail) {
      const ownerResult = await pool.query('SELECT id FROM users WHERE email = $1 AND role = $2', [ownerEmail, 'store_owner']);
      if (ownerResult.rows.length === 0) {
        return res.status(400).json({ message: 'Store owner with this email not found' });
      }
      ownerId = ownerResult.rows[0].id;
    }

    // Insert store
    const result = await pool.query(
      'INSERT INTO stores (name, email, address, owner_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, email, address || null, ownerId]
    );

    res.status(201).json({
      message: 'Store created successfully',
      store: result.rows[0]
    });
  } catch (error) {
    console.error('Create store error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
