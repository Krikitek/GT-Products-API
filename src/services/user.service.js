import pool from "../config/db.js";
import { ApiError } from "../utils/ApiError.js";
import bcrypt from 'bcrypt';

export async function createUser(userData) {
  const { username, email } = userData;

  try {
    // Insert new user
    const [result] = await pool.query(
      "INSERT INTO users (username, email) VALUES (?, ?)",
      [username, email]
    );

    // Get inserted user's full data
    return await getUserById(result.insertId);
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      throw new ApiError(409, "Username or email already exists.");
    }
    throw err; // Let other errors bubble up
  }
}

export async function getUserById(id) {
  const [rows] = await pool.query("SELECT * FROM users WHERE id = ?", [id]);

  if (rows.length === 0) {
    throw new ApiError(404, "User not found.");
  }

  return rows[0]; // Return single user object
}

export async function getAllUsers() {
  const [rows] = await pool.query("SELECT * FROM users");
  return rows; // Array of user objects
}

export const getPostsByAuthorId = async (userId) => {
  const [rows] = await pool.query("SELECT * FROM posts WHERE authorId = ?", [userId]);

  if (rows.length === 0) {
    throw new ApiError(404, "No posts found for this user");
  }

  return rows;
};

export const registerUser = async (userData) => {
    const { username, email, password } = userData; // Destructure password
    try {
        // HASH THE PASSWORD
        const saltRounds = 10; // The cost factor for hashing
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const [result] = await pool.query(
            // Use the new password column
            'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
            // Store the HASHED password, not the original
            [username, email, hashedPassword]
        );

        // Fetch the user, but OMIT the password from the return data
        const newUser = await getUserById(result.insertId);
        return newUser;

    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            throw new ApiError(409, "Username or email already exists.");
        }
        throw error;
    }
};

