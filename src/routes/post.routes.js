// src/routes/post.routes.js
import { Router } from 'express';
import { validatePost } from '../middlewares/validator.middleware.js';
import * as postController from '../controllers/post.controller.js'; // ✅ FIXED

// ... imports

const router = Router();

router.post("/", validatePost, postController.createPost);
router.put("/:id", validatePost, postController.updatePost);
router.get("/", postController.getAllPosts);
router.get("/:id", postController.getPostById);
router.delete("/:id", postController.deletePost);

export default router;
