const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

async function setupDatabase() {
  console.log('🚀 Starting database setup...');
  
  try {
    // Read the SQL file
    const sqlFilePath = path.join(__dirname, 'init-db.sql');
    let sql = fs.readFileSync(sqlFilePath, 'utf8');
    
    // Hash passwords for sample users
    const hashedPassword = await bcrypt.hash('Admin@123', 10);
    const hashedPasswordUser = await bcrypt.hash('User@123', 10);
    const hashedPasswordStore = await bcrypt.hash('Store@123', 10);
    
    // Replace placeholder passwords with real hashed passwords
    sql = sql.replace(/\$2a\$10\$1234567890123456789012u/g, hashedPassword);
    
    // Connect to database
    const client = await pool.connect();
    console.log('✅ Connected to database');
    
    // Execute the SQL script
    await client.query(sql);
    console.log('✅ Database tables created successfully');
    
    // Update with different passwords for different users
    await client.query('UPDATE users SET password = $1 WHERE email = $2', [hashedPasswordUser, 'johnsmith@example.com']);
    await client.query('UPDATE users SET password = $1 WHERE email = $2', [hashedPasswordStore, 'alicew@example.com']);
    await client.query('UPDATE users SET password = $1 WHERE email = $2', [hashedPasswordUser, 'bob@example.com']);
    await client.query('UPDATE users SET password = $1 WHERE email = $2', [hashedPasswordUser, 'sarah@example.com']);
    
    console.log('✅ Sample data inserted with proper passwords');
    
    // Verify the setup
    const userCount = await client.query('SELECT COUNT(*) FROM users');
    const storeCount = await client.query('SELECT COUNT(*) FROM stores');
    const ratingCount = await client.query('SELECT COUNT(*) FROM ratings');
    
    console.log(`📊 Database setup complete:`);
    console.log(`   - Users: ${userCount.rows[0].count}`);
    console.log(`   - Stores: ${storeCount.rows[0].count}`);
    console.log(`   - Ratings: ${ratingCount.rows[0].count}`);
    
    console.log('\n🔐 Login Credentials:');
    console.log('   Admin: admin@roxiler.com / Admin@123');
    console.log('   User: johnsmith@example.com / User@123');
    console.log('   Store Owner: alicew@example.com / Store@123');
    
    client.release();
    
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

setupDatabase();
