import app from './config/app.js'; // Importamos la aplicación Express configurada desde app.js

const PORT = process.env.PORT || 3000;

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});