const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Registro de usuario
exports.register = async (req, res) => {
    try {
        const { correo_electronico, contraseña } = req.body;
        console.log('Registrando usuario:', correo_electronico);

        if (!correo_electronico || !contraseña) {
            return res.status(400).json({ 
                success: false,
                message: 'Correo electrónico y contraseña son obligatorios' 
            });
        }

        // Verificar si el usuario ya existe
        const existingUser = await User.findByEmail(correo_electronico);
        if (existingUser) {
            return res.status(400).json({ 
                success: false,
                message: 'El correo electrónico ya está registrado' 
            });
        }

        // Encriptar contraseña
        const contraseña_hash = await bcrypt.hash(contraseña, 10);
        console.log('Hash generado:', contraseña_hash.substring(0, 20) + '...');

        // Crear usuario
        const userId = await User.create(correo_electronico, contraseña_hash);
        
        res.status(201).json({ 
            success: true,
            message: 'Usuario registrado exitosamente',
            userId 
        });

    } catch (error) {
        console.error('Error en registro:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error al registrar el usuario',
            error: error.message 
        });
    }
};

// Inicio de sesión
exports.login = async (req, res) => {
    try {
        const { correo_electronico, contraseña } = req.body;
        console.log('Intento de login para:', correo_electronico);

        if (!correo_electronico || !contraseña) {
            return res.status(400).json({ 
                success: false,
                message: 'Correo electrónico y contraseña son obligatorios' 
            });
        }

        // Buscar usuario
        const user = await User.findByEmail(correo_electronico);
        if (!user) {
            console.log('Usuario no encontrado');
            return res.status(404).json({ 
                success: false,
                message: 'Usuario no encontrado' 
            });
        }

        console.log('Comparando contraseña...');
        const isMatch = await bcrypt.compare(contraseña, user.contraseña_hash);
        console.log('Resultado comparación:', isMatch);

        if (!isMatch) {
            return res.status(401).json({ 
                success: false,
                message: 'Credenciales incorrectas' 
            });
        }

        // Generar token JWT
        const token = jwt.sign(
            { 
                id: user.id_usuario,
                email: user.correo_electronico,
                rol: user.rol 
            }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1h' }
        );

        res.status(200).json({ 
            success: true,
            message: 'Login exitoso',
            token,
            user: {
                id: user.id_usuario,
                email: user.correo_electronico,
                rol: user.rol
            }
        });

    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error al iniciar sesión',
            error: error.message 
        });
    }
};

// Obtener perfil
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ 
                success: false,
                message: 'Usuario no encontrado' 
            });
        }

        res.status(200).json({ 
            success: true,
            user: {
                id: user.id_usuario,
                email: user.correo_electronico,
                rol: user.rol
            }
        });

    } catch (error) {
        console.error('Error obteniendo perfil:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error al obtener el perfil',
            error: error.message 
        });
    }
};