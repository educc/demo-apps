const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL || "postgres://postgres:postgres@localhost:5432/myapp",
});

const createTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS persons (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            age INT NOT NULL
        );
    `;
    await pool.query(query);
};

const connectDB = async () => {
    try {
        await pool.connect();
        console.log('Connected to the PostgreSQL database');
        await createTable();
    } catch (error) {
        console.error('Database connection error:', error);
        process.exit(1);
    }
};

module.exports = {
    pool,
    connectDB,
};