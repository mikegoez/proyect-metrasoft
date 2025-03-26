const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    // para obtener el token del header
    const token = req.header('Authorization');

    // para verificar si no hay token
    if (!token) {
        return res.status(401).json({ message: 'Acceso denegado. No se proporcionó un token.' });
    }

    try {
        // para eliminar el prefijo "Bearer " del token
        const tokenWithoutBearer = token.replace('Bearer ', '');

        // para verificar el token
        const decoded = jwt.verify(tokenWithoutBearer, process.env.JWT_SECRET);

        // para asignar el usuario decodificado a la solicitud
        req.user = decoded;

        // para continuar con la siguiente función middleware
        next();
    } catch (error) {
        res.status(400).json({ message: 'Token inválido' });
    }
};

module.exports = auth;