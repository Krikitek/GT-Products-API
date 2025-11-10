// src/services/post.service.js
import pool from '../config/db.js';
import { ApiError } from '../utils/ApiError.js';

export const getAllPosts = async () => {
  const [posts] = await pool.query("SELECT * FROM posts");
  if (posts.length === 0) {
    throw new ApiError(404, "No posts found");
  }
  return posts;
};

// ✅ Get single post by ID
export const getPostById = async (id) => {
  const [rows] = await pool.query("SELECT * FROM posts WHERE id = ?", [id]);
  if (!rows[0]) {
    throw new ApiError(404, "Post not found");
  }
  return rows[0];
};

// ✅ Create new post (now includes authorId)
export const createPost = async (postData) => {
  const { title, content } = postData; // No longer need authorId from here
    try {
        const [result] = await pool.query(
            'INSERT INTO posts (title, content, authorId) VALUES (?, ?, ?)',
            [title, content, authorId] // Use the authorId from the argument
        );
        const newPost = await getPostById(result.insertId);
        return newPost;
    } catch (err) {
    if (err.code === "ER_NO_REFERENCED_ROW_2") {
      throw new ApiError(400, "Invalid author ID. User does not exist.");
    }
    throw err; // rethrow any other DB errors
  }
};

// ✅ Update post (replace all fields)
export const updatePost = async (id, postData, userId) => { // Add userId as an argument
    const { title, content } = postData;

    // First, get the post to check for ownership
    const post = await getPostById(id); // This will throw a 404 if not found

    // AUTHORIZATION CHECK
    if (post.authorId !== userId) {
        throw new ApiError(403, "Forbidden: You do not have permission to edit this post.");
    }

    // If the check passes, proceed with the update
    await pool.query(
        'UPDATE posts SET title = ?, content = ? WHERE id = ?',
        [title, content, id]
    );
    const updatedPost = await getPostById(id);
    return updatedPost;
};

// ✅ Partially update post
export const partiallyUpdatePost = async (id, updates) => {
  const fields = Object.keys(updates);
  const values = Object.values(updates);

  if (fields.length === 0) {
    return getPostById(id);
  }

  const setClause = fields.map((field) => `${field} = ?`).join(", ");

  const [result] = await pool.query(
    `UPDATE posts SET ${setClause} WHERE id = ?`,
    [...values, id]
  );

  if (result.affectedRows === 0) {
    throw new ApiError(404, "Post not found");
  }

  return getPostById(id);
};

// ✅ Delete post
export const deletePost = async (id, userId) => { // Add userId as an argument
    // First, get the post to check for ownership
    const post = await getPostById(id); // This will throw a 404 if not found

    // AUTHORIZATION CHECK
    if (post.authorId !== userId) {
        throw new ApiError(403, "Forbidden: You do not have permission to delete this post.");
    }
    
    // If the check passes, proceed with the deletion
    const [result] = await pool.query('DELETE FROM posts WHERE id = ?', [id]);
    return result.affectedRows;
};

