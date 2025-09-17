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
  const { title, content, authorId } = postData;

  if (!title || !content || !authorId) {
    throw new ApiError(400, "Title, content, and authorId are required");
  }

  try {
    const [result] = await pool.query(
      "INSERT INTO posts (title, content, authorId) VALUES (?, ?, ?)",
      [title, content, authorId]
    );

    if (result.affectedRows === 0) {
      throw new ApiError(500, "Failed to create post");
    }

    return getPostById(result.insertId);
  } catch (err) {
    if (err.code === "ER_NO_REFERENCED_ROW_2") {
      throw new ApiError(400, "Invalid author ID. User does not exist.");
    }
    throw err; // rethrow any other DB errors
  }
};

// ✅ Update post (replace all fields)
export const updatePost = async (id, postData) => {
  const { title, content } = postData;

  if (!title || !content) {
    throw new ApiError(400, "Title and content are required");
  }

  const [result] = await pool.query(
    "UPDATE posts SET title = ?, content = ? WHERE id = ?",
    [title, content, id]
  );

  if (result.affectedRows === 0) {
    throw new ApiError(404, "Post not found");
  }

  return getPostById(id);
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
export const deletePost = async (id) => {
  const [result] = await pool.query("DELETE FROM posts WHERE id = ?", [id]);

  if (result.affectedRows === 0) {
    throw new ApiError(404, "Post not found");
  }

  return true;
};

export async function createComment({ comment, authorId, postId}) {
  // Check if author exists
  const author = await db.query("SELECT id FROM users WHERE id = $1", [authorId]);
  if (author.rows.length === 0) {
    throw new ApiError(400, "Invalid authorId");
  }

  // Check if post exists
  const post = await db.query("SELECT id FROM posts WHERE id = $1", [postId]);
  if (post.rows.length === 0) {
    throw new ApiError(400, "Invalid postId");
  }

  // Insert comment
  const result = await db.query(
    `INSERT INTO comments (comment, user_id, postId)
     VALUES ($1, $2, $3) RETURNING *`,
    [comment, authorId, postId]
  );

  return result.rows[0];
};

export async function getCommentsByPostId(postId) {
  const result = await db.query(
    `SELECT c.*, u.username AS author
     FROM comments c
     JOIN users u ON c.user_id = u.id
     WHERE c.postId = $1
     ORDER BY c.createdAt DESC`,
    [postId]
  );

  if (result.rows.length === 0) {
    throw new ApiError(404, "No comments found for this post");
  }

  return result.rows;
};


