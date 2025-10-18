import { Router } from "express";
import * as userController from "../controllers/user.controller.js";

const router = Router();

router.get("/", userController.getAllUsers);   // GET /api/users
router.get("/:id", userController.getUserById); // GET /api/users/:id
router.get("/:id/posts", userController.getPostsByUser);

export default router;