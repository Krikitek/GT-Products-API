// src/routes/v1/auth.routes.js
import { Router } from 'express';
import * as authController from '../../controllers/auth.controller.js';
import { validateRegistration } from '../../middlewares/validator.middleware.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User login & registration
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login an existing user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: StrongPassword123!
 *     responses:
 *       200:
 *         description: Successful login
 *       400:
 *         description: Invalid credentials
 *       500:
 *         description: Server error
 */
router.post('/login', authController.loginUser);

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: Crisjay
 *               email:
 *                 type: string
 *                 example: crisjay@example.com
 *               password:
 *                 type: string
 *                 example: StrongPassword123!
 *     responses:
 *       201:
 *         description: User successfully registered
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
router.post('/register', validateRegistration, authController.registerUser);

export default router;
