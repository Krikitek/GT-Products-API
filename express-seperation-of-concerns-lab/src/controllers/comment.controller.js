// src/controllers/comments.controller.js
import * as commentservice from '../services/comment.service.js';

export const getAllcomments = (req, res) => {
    const comments = commentservice.getAllcomments();
    res.json(comments);
};

export const getcommentsById = (req, res) => {
    const commentsId = parseInt(req.params.id, 10);
    const comments = commentservice.getcommentsById(commentsId);
    if (!comments) {
        return res.status(404).json({ message: 'comments not found.' });
    }
    res.json(comments);
};

export const createcomments = (req, res) => {
    const { name, price } = req.body;
    if (!name || !price) {
        return res.status(400).json({ message: 'comments required' });
    }
    const newcomments = commentservice.createcomments({ name, price });
    res.status(201).json(newcomments);
};

export const updatecomments = (req, res) => {
    const commentsId = parseInt(req.params.id, 10);
    const comments = commentservice.updatecomments(commentsId, req.body);
    if (!comments) {
        return res.status(404).json({ message: 'comments not found.' });
    }
    res.json(comments);
};

export const deletecomments = (req, res) => {
    const commentsId = parseInt(req.params.id, 10);
    const success = commentservice.deletecomments(commentsId);
    if (!success) {
        return res.status(404).json({ message: 'comments not found.' });
    }
    res.status(204).send();
};

export const patchcomments = (req, res) => {
    const commentsId = parseInt(req.params.id, 10);
    const comments = commentservice.patchcomments(commentsId, req.body);
    if (!comments) {
        return res.status(404).json({ message: 'comments not found.' });
    } 
    res.json(comments);
};