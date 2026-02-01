import pkg from "pg";
const { Pool } = pkg;

// const pool = new Pool({
//  connectionString: process.env.DATABASE_URL,
//  ssl: { rejectUnauthorized: false }
// });
// Previous code above. Changes made address the following:
// No connection pool configuration (max connections, idle timeout, etc.)
// rejectUnauthorized set to false for SSL, which may pose security risks.
// No connection error handling.

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' 
    ? { rejectUnauthorized: true }
    : { rejectUnauthorized: false },
  max: 20, 
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

export default pool;
