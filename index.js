import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import helmet from 'helmet';
import cors from 'cors'; 
import rateLimit from 'express-rate-limit';  
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./src/config/swagger.js";

import { testConnection } from './src/config/db.js';
import { errorHandler } from './src/middlewares/errorHandler.middleware.js';

import postRoutes from './src/routes/v1/post.routes.js';
import commentRoutes from './src/routes/v1/comment.routes.js';
import userRoutes from "./src/routes/v1/user.routes.js";
import authRoutes from './src/routes/v1/auth.routes.js';
import photoRoutes from './src/routes/v1/photo.routes.js';

const app = express();
const port = 3000;

app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: false
  })
);

app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(apiLimiter);
app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api/v1/posts', postRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/comments', commentRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/photos', photoRoutes);

app.use('/uploads', express.static('uploads'));
app.use(express.static('public'));

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  testConnection();
});
