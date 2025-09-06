// src/routes/comments.routes.js
import { Router } from 'express';
import * as commentsController from '../controllers/comment.controller.js';

const router = Router();

router.get('/', commentsController.getAllcomments);
router.post('/', commentsController.createcomments);
router.get('/:id', commentsController.getcommentsById);
router.put('/:id', commentsController.updatecomments);

export default router;