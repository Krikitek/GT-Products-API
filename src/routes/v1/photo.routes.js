// src/routes/v1/photo.routes.js
import { Router } from 'express';
import * as photoController from '../../controllers/photo.controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import upload from '../../middlewares/multer.middleware.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Photos
 *   description: User photo management
 */

/**
 * @swagger
 * /photos:
 *   get:
 *     summary: Get all photos (Feed)
 *     tags: [Photos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all photos
 *       401:
 *         description: Unauthorized - Invalid or missing token
 */
router.get('/', authMiddleware, photoController.getAllPhotos);

/**
 * @swagger
 * /photos/user:
 *   get:
 *     summary: Get all photos uploaded by the authenticated user
 *     tags: [Photos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user photos
 *       401:
 *         description: Unauthorized - Invalid or missing token
 */
router.get('/user', authMiddleware, photoController.getUserPhotos);

/**
 * @swagger
 * /photos/{id}:
 *   delete:
 *     summary: Delete a photo of the authenticated user
 *     tags: [Photos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the photo to delete
 *     responses:
 *       200:
 *         description: Photo deleted successfully
 *       404:
 *         description: Photo not found
 *       401:
 *         description: Unauthorized
 */
router.delete('/:id', authMiddleware, photoController.deleteUserPhoto);

/**
 * @swagger
 * /photos/upload:
 *   post:
 *     summary: Upload a new photo
 *     tags: [Photos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               photo:
 *                 type: string
 *                 format: binary
 *                 description: Photo file to upload
 *     responses:
 *       201:
 *         description: Photo uploaded successfully
 *       400:
 *         description: No file uploaded
 *       401:
 *         description: Unauthorized
 */
router.post('/upload', authMiddleware, upload.single('photo'), photoController.uploadPhoto);

export default router;
