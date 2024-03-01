import express from 'express'
import { createPost, updatePost, deletePost } from '../controllers/postController.js'
import { authMiddleware } from '../middleware/authMiddleware.js'

const api = express.Router()

api.post('/createPost', createPost)
api.put('/posts/:id', authMiddleware, updatePost);
api.delete('/posts/:id', authMiddleware, deletePost);

export default api