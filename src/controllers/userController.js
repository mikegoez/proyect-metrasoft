const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Registrar un usuario
exports.register = async (req, res) => {
    try {
        const { correo_electronico, contraseña } = req.body;

        // Validación básica
        if (!correo_electronico || !contraseña) {
            return res.status(400).json({ message: 'Correo electrónico y contraseña son obligatorios' });
        }

        // Verificar si el usuario ya existe
        const existingUser = await User.findByEmail(correo_electronico);
        if (existingUser) {
            return res.status(400).json({ message: 'El correo electrónico ya está registrado' });
        }

        // Encriptar la contraseña
        const contraseña_hash = await bcrypt.hash(contraseña, 10);

        // Crear un nuevo usuario
        const userId = await User.create(correo_electronico, contraseña_hash);

        // Respuesta exitosa
        res.status(201).json({ message: 'Usuario registrado exitosamente', userId });
    } catch (error) {
        res.status(500).json({ message: 'Error al registrar el usuario', error: error.message });
    }
};

// Iniciar sesión
exports.login = async (req, res) => {
    try {
        const { correo_electronico, contraseña } = req.body;

        // Validación
        if (!correo_electronico || !contraseña) {
            return res.status(400).json({ message: 'Correo electrónico y contraseña son obligatorios' });
        }

        // Buscar usuario en la base de datos
        const user = await User.findByEmail(correo_electronico);

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Verificar contraseña
        const isMatch = await bcrypt.compare(contraseña, user.contraseña_hash);
        if (!isMatch) {
            return res.status(400).json({ message: 'Credenciales incorrectas' });
        }

        // Generar token JWT
        const token = jwt.sign({ id: user.id_usuario }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Respuesta exitosa
        res.status(200).json({ message: 'Login exitoso', token });
    } catch (error) {
        res.status(500).json({ message: 'Error al iniciar sesión', error: error.message });
    }
};

// Obtener perfil del usuario
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el perfil', error: error.message });
    }
};