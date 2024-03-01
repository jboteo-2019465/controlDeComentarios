import express from 'express'
import { login, register, test, update } from '../controllers/authController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const api = express.Router();


api.get('/test', test)
api.post('/register', register)
api.post('/login', login)
api.put('/update', authMiddleware, update)

export default api