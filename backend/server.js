const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { pool } = require('./config/database');
const path = require('path');
const fs = require('fs');
const corsMiddleware = require('./middleware/cors');

dotenv.config();

const app = express();

// CORS configuration
app.use(corsMiddleware);

// Middleware
app.use(express.json());

// Test database connection
pool.connect((err, client, release) => {
  if (err) {
    console.error('Error connecting to database:', err);
  } else {
    console.log('Connected to PostgreSQL database');
    release();
  }
});

// Health check endpoint for Render
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/user', require('./routes/user'));
app.use('/api/store', require('./routes/store'));

// Serve static files from React app (only if dist folder exists)
const frontendPath = path.join(__dirname, '../frontend/dist');
if (fs.existsSync(frontendPath)) {
  app.use(express.static(frontendPath));
  
  // Catch all handler for React Router
  app.get('*', (req, res) => {
    if (!req.url.startsWith('/api/')) {
      res.sendFile(path.join(frontendPath, 'index.html'));
    }
  });
} else {
  console.log('Frontend build not found. API-only mode enabled.');
  
  // Default route for API-only mode
  app.get('/', (req, res) => {
    res.json({ 
      message: 'Store Rating Management API',
      status: 'running',
      endpoints: ['/api/auth', '/api/stores', '/api/ratings', '/api/admin']
    });
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: process.env.NODE_ENV === 'production' 
      ? 'Something went wrong!' 
      : err.message 
  });
});

// Database initialization function
const initializeDatabase = async () => {
  if (process.env.NODE_ENV === 'production' && process.env.INIT_DB === 'true') {
    try {
      console.log('🔄 Checking database tables...');
      
      // Check if users table exists
      const tableCheck = await pool.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' AND table_name = 'users'
        );
      `);
      
      if (!tableCheck.rows[0].exists) {
        console.log('🚀 Initializing database tables...');
        
        // Run the setup script
        const fs = require('fs');
        const path = require('path');
        const bcrypt = require('bcryptjs');
        
        const sqlFilePath = path.join(__dirname, 'scripts', 'init-db.sql');
        let sql = fs.readFileSync(sqlFilePath, 'utf8');
        
        // Hash passwords
        const hashedPassword = await bcrypt.hash('Admin@123', 10);
        sql = sql.replace(/\$2a\$10\$1234567890123456789012u/g, hashedPassword);
        
        const client = await pool.connect();
        await client.query(sql);
        
        // Update with different passwords
        const hashedPasswordUser = await bcrypt.hash('User@123', 10);
        const hashedPasswordStore = await bcrypt.hash('Store@123', 10);
        
        await client.query('UPDATE users SET password = $1 WHERE email = $2', [hashedPasswordUser, 'johnsmith@example.com']);
        await client.query('UPDATE users SET password = $1 WHERE email = $2', [hashedPasswordStore, 'alicew@example.com']);
        await client.query('UPDATE users SET password = $1 WHERE email = $2', [hashedPasswordUser, 'bob@example.com']);
        await client.query('UPDATE users SET password = $1 WHERE email = $2', [hashedPasswordUser, 'sarah@example.com']);
        
        client.release();
        console.log('✅ Database initialized successfully');
      } else {
        console.log('✅ Database tables already exist');
      }
    } catch (error) {
      console.error('❌ Database initialization failed:', error);
      // Don't exit - let the app continue in case tables exist but check failed
    }
  }
};

const PORT = process.env.PORT || 5000;

// Initialize database before starting server
(async () => {
  await initializeDatabase();
  
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  });
})();

// Temporary setup endpoint (remove after setup)
app.post('/setup-database-temp', async (req, res) => {
  if (process.env.NODE_ENV !== 'production') {
    return res.status(403).json({ message: 'Only available in production' });
  }
  
  try {
    await initializeDatabase();
    res.json({ message: 'Database setup completed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Database setup failed', error: error.message });
  }
});
