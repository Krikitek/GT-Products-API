import express from 'express';
import postRoutes from './src/routes/post.routes.js';
import { testConnection } from './src/config/db.js';
import { errorHandler } from './src/middlewares/errorHandler.middleware.js';
import userRoutes from "./src/routes/user.routes.js";

const app = express();
const port = 3000;

// Middleware
app.use(express.json());

// Routes
app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);

// Global error handler (should be after all routes)
app.use(errorHandler);

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  testConnection(); // Test DB connection on startup
});
