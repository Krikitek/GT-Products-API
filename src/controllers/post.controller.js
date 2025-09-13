import * as postService from '../services/post.service.js'; 
import { ApiResponse } from '../utils/ApiResponse.js';
import asyncHandler from 'express-async-handler';

// ✅ Get all posts
export const getAllPosts = asyncHandler(async (req, res) => {
  const posts = await postService.getAllPosts();
  return res
    .status(200)
    .json(new ApiResponse(200, posts, "Posts retrieved successfully"));
});

// ✅ Get single post by ID
export const getPostById = asyncHandler(async (req, res) => {
  const postId = parseInt(req.params.id, 10);
  const post = await postService.getPostById(postId);
  return res
    .status(200)
    .json(new ApiResponse(200, post, "Post retrieved successfully"));
});

// ✅ Create post
export const createPost = asyncHandler(async (req, res) => {
  const newPost = await postService.createPost(req.body);
  return res
    .status(201)
    .json(new ApiResponse(201, newPost, "Post created successfully"));
});

// ✅ Update post
export const updatePost = asyncHandler(async (req, res) => {
  const postId = parseInt(req.params.id, 10);
  const updatedPost = await postService.updatePost(postId, req.body);
  return res
    .status(200)
    .json(new ApiResponse(200, updatedPost, "Post updated successfully"));
});

// ✅ Delete post
export const deletePost = asyncHandler(async (req, res) => {
  const postId = parseInt(req.params.id, 10);
  await postService.deletePost(postId);
  return res
    .status(200)
    .json(new ApiResponse(200, null, "Post deleted successfully"));
});


