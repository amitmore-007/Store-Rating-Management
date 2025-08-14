-- Store Rating Management System Database Schema

-- Drop tables if they exist (for clean setup)
DROP TABLE IF EXISTS ratings CASCADE;
DROP TABLE IF EXISTS stores CASCADE;
DROP TABLE IF EXISTS users CASCADE;

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

-- Create ratings table
CREATE TABLE ratings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    store_id INTEGER NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, store_id) -- One rating per user per store
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_stores_owner_id ON stores(owner_id);
CREATE INDEX idx_ratings_user_id ON ratings(user_id);
CREATE INDEX idx_ratings_store_id ON ratings(store_id);
CREATE INDEX idx_ratings_created_at ON ratings(created_at);

-- Insert sample data
INSERT INTO users (name, email, password, address, role) VALUES
('System Admin', 'admin@roxiler.com', '$2a$10$1234567890123456789012u', '123 Admin Street, Admin City', 'system_admin'),
('John Smith', 'johnsmith@example.com', '$2a$10$1234567890123456789012u', '456 User Avenue, User City', 'normal_user'),
('Alice Wilson', 'alicew@example.com', '$2a$10$1234567890123456789012u', '789 Owner Boulevard, Owner City', 'store_owner'),
('Bob Johnson', 'bob@example.com', '$2a$10$1234567890123456789012u', '321 Customer Lane, Customer City', 'normal_user'),
('Sarah Davis', 'sarah@example.com', '$2a$10$1234567890123456789012u', '654 Reviewer Road, Reviewer City', 'normal_user');

INSERT INTO stores (name, email, address, owner_id) VALUES
('TechWorld Electronics', 'info@techworld.com', '100 Technology Drive, Tech City', 3),
('Fashion Hub', 'contact@fashionhub.com', '200 Style Street, Fashion District', 3),
('Green Grocery', 'hello@greengrocery.com', '300 Fresh Avenue, Organic Town', NULL),
('BookWorm Cafe', 'books@bookworm.com', '400 Reading Road, Literature City', NULL),
('Fitness Pro Gym', 'info@fitnesspro.com', '500 Health Street, Wellness District', NULL);

INSERT INTO ratings (user_id, store_id, rating, comment) VALUES
(2, 1, 5, 'Excellent electronics store with great customer service!'),
(2, 2, 4, 'Good fashion selection, reasonable prices.'),
(4, 1, 4, 'Quality products, fast delivery.'),
(4, 3, 5, 'Fresh organic produce, highly recommended!'),
(5, 2, 3, 'Average experience, could be better.'),
(5, 4, 5, 'Perfect place for book lovers and coffee enthusiasts!'),
(2, 5, 4, 'Great gym facilities and equipment.');

-- Update updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_stores_updated_at BEFORE UPDATE ON stores
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ratings_updated_at BEFORE UPDATE ON ratings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions (adjust as needed for your database user)
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO your_db_user;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO your_db_user;
