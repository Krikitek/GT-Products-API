import * as postService from '../services/post.service.js'; 


    export const getAllPosts = async (req, res) => {
        try {
            const posts = await postService.getAllPosts();
            res.json(posts);
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving posts', error: error.message });
        }
    };

    // (Apply the same async/await and try/catch pattern to all other controller functions:
    // getPostById, createPost, updatePost, partiallyUpdatePost, and deletePost)
// ✅ Get single post by ID
export const getPostById = async (req, res) => {
  try {
    const postId = parseInt(req.params.id, 10);
    const post = await postService.getPostById(postId);

    if (!post) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Post not found"));
    }

    return res
      .status(200)
      .json(new ApiResponse(200, post, "Post retrieved successfully"));
  } catch (error) {
    console.error("Error fetching post:", error);
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Failed to fetch post"));
  }
};

// ✅ Create post
export const createPost = async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res
        .status(400)
        .json(new ApiResponse(400, null, "Title and content are required"));
    }

    const newPost = await postService.createPost({ title, content });

    return res
      .status(201)
      .json(new ApiResponse(201, newPost, "Post created successfully"));
  } catch (error) {
    console.error("Error creating post:", error);
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Failed to create post"));
  }
};

// ✅ Update post (replace all fields)
export const updatePost = async (req, res) => {
  try {
    const postId = parseInt(req.params.id, 10);
    const updatedPost = await postService.updatePost(postId, req.body);

    if (!updatedPost) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Post not found"));
    }

    return res
      .status(200)
      .json(new ApiResponse(200, updatedPost, "Post updated successfully"));
  } catch (error) {
    console.error("Error updating post:", error);
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Failed to update post"));
  }
};

// ✅ Delete post
export const deletePost = async (req, res) => {
  try {
    const postId = parseInt(req.params.id, 10);
    const success = await postService.deletePost(postId);

    if (!success) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Post not found"));
    }

    return res
      .status(204)
      .send(); // No content
  } catch (error) {
    console.error("Error deleting post:", error);
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Failed to delete post"));
  }
};
