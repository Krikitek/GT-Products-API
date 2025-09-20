import { Router } from 'express';
import * as commentController from '../controllers/comment.controller.js'; 

// ... imports

const router = Router();
router.get("/", commentController.getAllComments);
router.get("/:postId", commentController.getCommentsByPostId)

export default router;