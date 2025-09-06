// src/controllers/post.controller.js
import * as postService from '../services/post.service.js';

export const getAllPosts = (req, res) => {
    const posts = postService.getAllPosts();
    res.json(posts);
};

export const getPostById = (req, res) => {
    const postId = parseInt(req.params.id, 10);
    const post = postService.getPostById(postId);
    if (!post) {
        return res.status(404).json({ message: 'Post not found.' });
    }
    res.json(post);
};

export const createPost = (req, res) => {
    const { name, price } = req.body;
    if (!name || !price) {
        return res.status(400).json({ message: 'name and price are required.' });
    }
    const newPost = postService.createPost({ name, price });
    res.status(201).json(newPost);
};

export const updatePost = (req, res) => {
    const postId = parseInt(req.params.id, 10);
    const post = postService.updatePost(postId, req.body);
    if (!post) {
        return res.status(404).json({ message: 'Post not found.' });
    }
    res.json(post);
};

export const deletePost = (req, res) => {
    const postId = parseInt(req.params.id, 10);
    const success = postService.deletePost(postId);
    if (!success) {
        return res.status(404).json({ message: 'Post not found.' });
    }
    res.status(204).send();
};

export const patchPost = (req, res) => {
    const postId = parseInt(req.params.id, 10);
    const post = postService.patchPost(postId, req.body);
    if (!post) {
        return res.status(404).json({ message: 'Post not found.' });
    } 
    res.json(post);
};