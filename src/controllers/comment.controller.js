import * as commentService from '../services/comment.service.js'; 
import { ApiResponse } from '../utils/ApiResponse.js';
import asyncHandler from 'express-async-handler';

export const getAllComments = asyncHandler(async (req, res) => {
  const comments = await commentService.getAllComments();
  res.status(200).json(new ApiResponse(200, comments, "Comments fetched successfully"));
});

export const getCommentsByPostId = asyncHandler(async (req, res) => {
  const postId = parseInt(req.params.postId, 10);
  if (isNaN(postId)) {
    return res.status(400).json(new ApiResponse(400, null, "Invalid postId"));
  }

  const comments = await commentService.getCommentsByPostId(postId);
  res.status(200).json(new ApiResponse(200, comments, "Comments fetched successfully"));
});

export const createCommentForPost = asyncHandler(async (req, res) => {
  const postId = parseInt(req.params.postId, 10);
  if (isNaN(postId)) {
    return res.status(400).json(new ApiResponse(400, null, "Invalid postId"));
  }

  const { text } = req.body;
  if (!text) {
    return res.status(400).json(new ApiResponse(400, null, "Comment text is required"));
  }

  // safer to get from auth middleware, but keeping your style for now:
  const authorId = req.body.authorId;

  const newComment = await commentService.createComment(postId, authorId, { text });
  res.status(201).json(new ApiResponse(201, newComment, "Comment created successfully"));
});
