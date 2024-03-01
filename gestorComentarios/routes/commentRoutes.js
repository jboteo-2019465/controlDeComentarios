import express from 'express';
import { createComment, deleteComment, updateComment } from '../controllers/commentController.js';
import {authMiddleware} from '../middleware/authMiddleware.js';

const api = express.Router();

// Ruta para crear un comentario en un post específico
api.post('/posts/:postId/comments', authMiddleware, createComment);
api.put('/posts/:commentId/comments', authMiddleware, updateComment);
api.delete('/posts/:commentId/comments', authMiddleware, deleteComment);


export default api;
