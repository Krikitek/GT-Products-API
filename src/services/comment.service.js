import pool from "../config/db.js"; 
import { ApiError } from "../utils/ApiError.js";

export const getAllComments = async () => {
  const [comments] = await pool.query(
    "SELECT * FROM comments ORDER BY createdAt DESC"
  );

  if (comments.length === 0) {
    throw new ApiError(404, "No comments found");
  }

  return comments;
};

export const getCommentsByPostId = async (postId) => {
  const [comments] = await pool.query(
    `SELECT c.*, u.username AS author
     FROM comments c
     JOIN users u ON c.authorId = u.id
     WHERE c.postId = ?
     ORDER BY c.createdAt DESC`,
    [postId]
  );

  if (comments.length === 0) {
    throw new ApiError(404, `No comments found for postId: ${postId}`);
  }

  return comments;
};

// 🔹 Create a new comment
export const createComment = async (postId, authorId, commentData) => {
  try {
    const [insertResult] = await pool.query(
      `INSERT INTO comments (text, postId, authorId)
       VALUES (?, ?, ?)`,
      [commentData.text, postId, authorId]
    );

    const newCommentId = insertResult.insertId; // ✅ mysql2 gives insertId

    const [result] = await pool.query(
      `SELECT c.*, u.username AS author
       FROM comments c
       JOIN users u ON c.authorId = u.id
       WHERE c.id = ?`,
      [newCommentId]
    );

    return result[0];
  } catch (error) {
    if (error.code === "ER_NO_REFERENCED_ROW_2") {
      throw new ApiError(
        400,
        "Invalid postId or authorId. The specified post or user does not exist."
      );
    }
    throw new ApiError(500, "Failed to create comment");
  }
};