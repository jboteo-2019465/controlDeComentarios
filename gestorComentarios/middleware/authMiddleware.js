import jwt from 'jsonwebtoken'
import User from '../models/user.js'

/*export const authMiddleware = async(req, res, next) => {
  try {
    let secretKey = process.env.JWT_SECRET

    // Obtener el token del encabezado de la solicitud
    let { authorization } = req.headers
    console.log(authorization)

    // Verificar si no hay token
    if (!authorization) {
      return res.status(401).send({ message: 'No hay token, autorización denegada' });
    }
    // Verificar el token
    let { uid } = jwt.verify(authorization, secretKey)
    //Validar si aun existe en la base de datos
    let user = await User.findOne({ _id: uid })
    if (!user) return res.status(404).send({ mesage: 'User not found - Unauthorized' })
    req.user = user
    next()
  } catch (error) {
    // Si el token no es válido
    res.status(401).send({ message: 'Token no válido' });
  }
};*/
export const authMiddleware = (req, res, next) => {
  // Obtener el token de los headers de la solicitud
  const token = req.headers.authorization;
  // Verificar si el token existe
  if (!token) {
      return res.status(401).json({ message: 'Token de autenticación no proporcionado.' });
  }
  try {
      // Verificar y decodificar el token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // Añadir el objeto decodificado al objeto de solicitud para uso posterior
      req.user = decoded;
      // Pasar al siguiente middleware
      next();
  } catch (error) {
      console.error(error);
      return res.status(401).json({ message: 'Token de autenticación inválido.' });
  }
};


