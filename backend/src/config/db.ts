import { Pool } from 'pg';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Create a PostgreSQL pool connection using the values from .env
const pool = new Pool({
  host: process.env.DB_HOST,         // Supabase host
  port: parseInt(process.env.DB_PORT || '5432', 10), // Supabase port (5432)
  database: process.env.DB_NAME,     // Database name
  user: process.env.DB_USER,         // Username (postgres)
  password: process.env.DB_PASSWORD, // Password
  ssl: {
    rejectUnauthorized: false,       // Disables SSL certificate validation (for cloud PostgreSQL databases like Supabase)
  },
});

// Test the connection (optional)
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error connecting to the database:', err);
  } else {
    console.log('Connected to the database:', res.rows);
  }
});

export default pool;
