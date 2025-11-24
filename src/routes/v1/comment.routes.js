// src/routes/v1/comment.routes.js
import { Router } from 'express';
import * as commentController from '../../controllers/comment.controller.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: Endpoints for managing comments
 */

/**
 * @swagger
 * /comments:
 *   get:
 *     summary: Retrieve all comments
 *     tags: [Comments]
 *     responses:
 *       200:
 *         description: List of all comments
 */
router.get("/", commentController.getAllComments);

export default router;
