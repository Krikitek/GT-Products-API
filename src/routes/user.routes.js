import { Router } from "express";
import * as userController from "../controllers/user.controller.js";

const router = Router();

// Define routes
router.post("/", userController.createUser);   // POST /api/users
router.get("/", userController.getAllUsers);   // GET /api/users
router.get("/:id", userController.getUserById); // GET /api/users/:id
router.get("/:id/posts", userController.getPostsByUser);

export default router;
