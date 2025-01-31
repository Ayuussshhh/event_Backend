const mysql = require('mysql2/promise');

// Connect to MySQL using connection pooling
const connectMysql2 = async () => {
    try {
        const pool = await mysql.createPool({
            uri: process.env.MYSQL_URI, // Ensure this is correctly set in `.env`
            connectionLimit: 10, // Maximum number of connections in the pool
        });
        console.log('MySQL Connected!');
        return pool;
    } catch (err) {
        console.error('MySQL Connection Error:', err.message);
        process.exit(1); // Stop the application if the database fails to connect
    }
};

module.exports = connectMysql2;
