// src/config/db.js
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config(); // Load .env first

const pool = mysql.createPool({
  host: "localhost",
  port: "3306",
  user: "root",
  password: "1234",
  database: "blogdatabase",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// ✅ Test function
export const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log("✅ Successfully connected to the MySQL database.");
    connection.release();
  } catch (error) {
    console.error("❌ Unable to connect to the database:", error.message);
  }
};

export default pool;
