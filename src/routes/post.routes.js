// src/routes/post.routes.js
import { Router } from 'express';
import { validatePost } from '../middlewares/validator.middleware.js';
import { validateComment } from '../middlewares/validator.middleware.js';
import * as postController from '../controllers/post.controller.js'; 
import * as commentController from '../controllers/comment.controller.js'; 
import { authMiddleware } from '../middlewares/auth.middleware.js'; 

// ... imports

const router = Router();

router.post("/", authMiddleware, validatePost, postController.createPost);
router.put("/:id", validatePost, postController.updatePost);
router.get("/", postController.getAllPosts);
router.get("/:id", postController.getPostById);
router.delete("/:id", postController.deletePost);
router.get("/:postId/comments", commentController.getCommentsByPostId);
router.post("/:postId/comments", validateComment, commentController.createCommentForPost);

export default router;
