// index.js
import express from 'express';
import postRoutes from './src/routes/post.route.js';

const app = express();
const port = 3000;

app.use(express.json());

// Mount the post routes
app.use('/posts', postRoutes);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});