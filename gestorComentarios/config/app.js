import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './mongo.js';
import helmet from 'helmet'
import authRoutes from '../routes/authRoutes.js'
import postRoutes from '../routes/postRoutes.js'
import commentRoutes from '../routes/commentRoutes.js'

dotenv.config();

export const app = express();
const PORT = process.env.PORT || 3000;

// Conectar a la base de datos MongoDB
connectDB();

// Configurar middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(helmet());

// Ruta de inicio
app.get('/', (req, res) => {
    res.send('Welcome to Comment Manager');
});

app.use(authRoutes)
app.use(postRoutes)
app.use(commentRoutes)


// Exportar la aplicación Express configurada
export default app;