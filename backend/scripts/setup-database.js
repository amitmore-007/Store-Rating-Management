const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

// Use environment variables or command line arguments
const DATABASE_URL = process.env.DATABASE_URL || process.argv[2];

if (!DATABASE_URL) {
  console.error('❌ Please provide DATABASE_URL as environment variable or command line argument');
  console.log('Usage: node setup-database.js "your-postgres-url"');
  process.exit(1);
}

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // Always use SSL for production
});

async function setupDatabase() {
  console.log('🚀 Starting database setup...');
  console.log('📍 Database URL:', DATABASE_URL.replace(/\/\/[^:]+:[^@]+@/, '//***:***@'));
  
  try {
    // Test connection first
    const client = await pool.connect();
    console.log('✅ Connected to database successfully');
    
    // Create tables
    console.log('📋 Creating database tables...');
    
    await client.query(`
      -- Drop tables if they exist (for clean setup)
      DROP TABLE IF EXISTS ratings CASCADE;
      DROP TABLE IF EXISTS stores CASCADE;
      DROP TABLE IF EXISTS users CASCADE;
    `);
    console.log('🗑️ Dropped existing tables');
    
    await client.query(`
      -- Create users table
      CREATE TABLE users (
          id SERIAL PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          address TEXT,
          role VARCHAR(50) DEFAULT 'normal_user' CHECK (role IN ('normal_user', 'store_owner', 'system_admin')),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('👥 Created users table');
    
    await client.query(`
      -- Create stores table
      CREATE TABLE stores (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          address TEXT,
          owner_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('🏪 Created stores table');
    
    await client.query(`
      -- Create ratings table
      CREATE TABLE ratings (
          id SERIAL PRIMARY KEY,
          user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          store_id INTEGER NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
          rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
          comment TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(user_id, store_id)
      );
    `);
    console.log('⭐ Created ratings table');
    
    // Create indexes
    await client.query(`
      CREATE INDEX idx_users_email ON users(email);
      CREATE INDEX idx_users_role ON users(role);
      CREATE INDEX idx_stores_owner_id ON stores(owner_id);
      CREATE INDEX idx_ratings_user_id ON ratings(user_id);
      CREATE INDEX idx_ratings_store_id ON ratings(store_id);
      CREATE INDEX idx_ratings_created_at ON ratings(created_at);
    `);
    console.log('📊 Created database indexes');
    
    // Hash passwords
    const adminPassword = await bcrypt.hash('Admin@123', 10);
    const userPassword = await bcrypt.hash('User@123', 10);
    const storePassword = await bcrypt.hash('Store@123', 10);
    
    // Insert sample users
    await client.query(`
      INSERT INTO users (name, email, password, address, role) VALUES
      ('System Admin', 'admin@roxiler.com', $1, '123 Admin Street, Admin City', 'system_admin'),
      ('John Smith', 'johnsmith@example.com', $2, '456 User Avenue, User City', 'normal_user'),
      ('Alice Wilson', 'alicew@example.com', $3, '789 Owner Boulevard, Owner City', 'store_owner'),
      ('Bob Johnson', 'bob@example.com', $2, '321 Customer Lane, Customer City', 'normal_user'),
      ('Sarah Davis', 'sarah@example.com', $2, '654 Reviewer Road, Reviewer City', 'normal_user');
    `, [adminPassword, userPassword, storePassword]);
    console.log('👤 Inserted sample users');
    
    // Insert sample stores
    await client.query(`
      INSERT INTO stores (name, email, address, owner_id) VALUES
      ('TechWorld Electronics', 'info@techworld.com', '100 Technology Drive, Tech City', 3),
      ('Fashion Hub', 'contact@fashionhub.com', '200 Style Street, Fashion District', 3),
      ('Green Grocery', 'hello@greengrocery.com', '300 Fresh Avenue, Organic Town', NULL),
      ('BookWorm Cafe', 'books@bookworm.com', '400 Reading Road, Literature City', NULL),
      ('Fitness Pro Gym', 'info@fitnesspro.com', '500 Health Street, Wellness District', NULL);
    `);
    console.log('🏪 Inserted sample stores');
    
    // Insert sample ratings
    await client.query(`
      INSERT INTO ratings (user_id, store_id, rating, comment) VALUES
      (2, 1, 5, 'Excellent electronics store with great customer service!'),
      (2, 2, 4, 'Good fashion selection, reasonable prices.'),
      (4, 1, 4, 'Quality products, fast delivery.'),
      (4, 3, 5, 'Fresh organic produce, highly recommended!'),
      (5, 2, 3, 'Average experience, could be better.'),
      (5, 4, 5, 'Perfect place for book lovers and coffee enthusiasts!'),
      (2, 5, 4, 'Great gym facilities and equipment.');
    `);
    console.log('⭐ Inserted sample ratings');
    
    // Create trigger function
    await client.query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
          NEW.updated_at = CURRENT_TIMESTAMP;
          RETURN NEW;
      END;
      $$ language 'plpgsql';
    `);
    console.log('⚙️ Created trigger function');
    
    // Create triggers
    await client.query(`
      CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
          FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
      
      CREATE TRIGGER update_stores_updated_at BEFORE UPDATE ON stores
          FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
      
      CREATE TRIGGER update_ratings_updated_at BEFORE UPDATE ON ratings
          FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    `);
    console.log('🔄 Created update triggers');
    
    // Verify setup
    const userCount = await client.query('SELECT COUNT(*) FROM users');
    const storeCount = await client.query('SELECT COUNT(*) FROM stores');
    const ratingCount = await client.query('SELECT COUNT(*) FROM ratings');
    
    console.log('\n✅ Database setup completed successfully!');
    console.log(`📊 Setup Summary:`);
    console.log(`   • Users: ${userCount.rows[0].count}`);
    console.log(`   • Stores: ${storeCount.rows[0].count}`);
    console.log(`   • Ratings: ${ratingCount.rows[0].count}`);
    
    console.log('\n🔐 Login Credentials:');
    console.log('   👑 Admin: admin@roxiler.com / Admin@123');
    console.log('   👤 User: johnsmith@example.com / User@123');
    console.log('   🏪 Store Owner: alicew@example.com / Store@123');
    
    client.release();
    
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    console.error('Full error details:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Self-executing setup
if (require.main === module) {
  setupDatabase();
}

module.exports = { setupDatabase };
