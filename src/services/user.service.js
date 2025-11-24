import pool from "../config/db.js";
import { ApiError } from "../utils/ApiError.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export async function createUser(userData) {
  const { username, email } = userData;

  try {
    const [result] = await pool.query(
      "INSERT INTO users (username, email) VALUES (?, ?)",
      [username, email]
    );

    return await getUserById(result.insertId);
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      throw new ApiError(409, "Username or email already exists.");
    }
    throw err; 
  }
}

export async function getUserById(id) {
  const [rows] = await pool.query("SELECT id, username, email, createdAt FROM users WHERE id = ?", [id]);

  if (rows.length === 0) {
    throw new ApiError(404, "User not found.");
  }

  return rows[0];
}

export async function getAllUsers() {
  const [rows] = await pool.query("SELECT * FROM users");
  return rows; 
}

export const getPostsByAuthorId = async (userId) => {
  const [rows] = await pool.query("SELECT * FROM posts WHERE authorId = ?", [userId]);

  if (rows.length === 0) {
    throw new ApiError(404, "No posts found for this user");
  }

  return rows;
};

export const registerUser = async (userData) => {
    const { username, email, password } = userData; 
    try {
        const saltRounds = 10; 
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const [result] = await pool.query(
            'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
            [username, email, hashedPassword]
        );
        const newUser = await getUserById(result.insertId);
        return newUser;

    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            throw new ApiError(409, "Username or email already exists.");
        }
        throw error;
    }
};

export const loginUser = async (loginData) => {
    const { email, password } = loginData;

    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0) {
        throw new ApiError(401, "Invalid credentials"); 
    }
    const user = rows[0];

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
        throw new ApiError(401, "Invalid credentials"); 
    }

    const payload = {
        id: user.id,
        username: user.username,
        email: user.email
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '1h' 
    });

    return token;
};

