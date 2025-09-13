// src/routes/post.routes.js
import { Router } from 'express';
import { validatePost } from '../middlewares/validator.middleware.js';
import * as postController from '../controllers/post.controller.js'; // ✅ FIXED

// ... imports

const router = Router();

router.post('/', validatePost, postController.createPost);
router.put('/:id', validatePost, postController.updatePost);//e should create a separate validator for patch later

// ... other routes
export default router;
