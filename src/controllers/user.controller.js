// userController.js
import * as userService from "../services/user.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from 'express-async-handler';

// POST /users
export const createUser = asyncHandler(async (req, res) => {
  const newUser = await userService.createUser(req.body);

  res.status(201).json(
    new ApiResponse(201, "User created successfully.", newUser)
  );
});

// GET /users/:id
export const getUserById = asyncHandler(async (req, res) => {
  const user = await userService.getUserById(req.params.id);

  res.status(200).json(
    new ApiResponse(200, "User retrieved successfully.", user)
  );
});

// GET /users
export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await userService.getAllUsers();

  res.status(200).json(
    new ApiResponse(200, "Users retrieved successfully.", users)
  );
});

export const getPostsByUser = asyncHandler(async (req, res) => {
  const userId = parseInt(req.params.id, 10);

  const posts = await userService.getPostsByAuthorId(userId);

  res.status(200).json(
    new ApiResponse(200, "Posts retrieved successfully.", posts)
  );
});
