const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');

// @desc    Obtener perfil del usuario autenticado
// @route   GET /api/usuarios/perfil
// @access  Private
exports.getPerfil = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.usuario._id).select('-password');
    res.json({ success: true, data: usuario });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Actualizar perfil del usuario autenticado
// @route   PATCH /api/usuarios/perfil
// @access  Private
exports.updatePerfil = async (req, res) => {
  try {
    const { nombre, apellido, email } = req.body;
    
    // Verificar si el email ya existe en otro usuario
    if (email) {
      const existeEmail = await Usuario.findOne({ 
        email, 
        _id: { $ne: req.usuario._id } 
      });
      
      if (existeEmail) {
        return res.status(400).json({ 
          success: false, 
          error: 'El email ya está en uso' 
        });
      }
    }
    
    const usuario = await Usuario.findByIdAndUpdate(
      req.usuario._id,
      { nombre, apellido, email },
      { new: true, runValidators: true }
    ).select('-password');
    
    res.json({ success: true, data: usuario });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Cambiar contraseña
// @route   PATCH /api/usuarios/cambiar-password
// @access  Private
exports.cambiarPassword = async (req, res) => {
  try {
    const { passwordActual, passwordNuevo } = req.body;
    
    if (!passwordActual || !passwordNuevo) {
      return res.status(400).json({ 
        success: false, 
        error: 'Debes proporcionar la contraseña actual y la nueva' 
      });
    }
    
    const usuario = await Usuario.findById(req.usuario._id);
    
    // Verificar contraseña actual
    const passwordValido = await bcrypt.compare(passwordActual, usuario.password);
    if (!passwordValido) {
      return res.status(401).json({ 
        success: false, 
        error: 'Contraseña actual incorrecta' 
      });
    }
    
    // Actualizar contraseña
    usuario.password = passwordNuevo;
    await usuario.save();
    
    res.json({ 
      success: true, 
      message: 'Contraseña actualizada exitosamente' 
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Listar usuarios (ADMIN)
// @route   GET /api/usuarios
// @access  Private (ADMIN)
exports.list = async (req, res) => {
  try {
    const { page = 1, limit = 20, rol, q } = req.query;
    
    const query = {};
    
    if (rol) {
      query.rol = rol.toUpperCase();
    }
    
    if (q) {
      query.$or = [
        { nombre: { $regex: q, $options: 'i' } },
        { apellido: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } }
      ];
    }
    
    const usuarios = await Usuario.find(query)
      .select('-password')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 })
      .lean();
    
    const count = await Usuario.countDocuments(query);
    
    res.json({
      success: true,
      data: usuarios,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        pages: Math.ceil(count / limit)
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Listar estudiantes (PROFESOR/ADMIN)
// @route   GET /api/usuarios/estudiantes
// @access  Private (PROFESOR/ADMIN)
exports.listEstudiantes = async (req, res) => {
  try {
    const { page = 1, limit = 50, q } = req.query;
    
    const query = { rol: 'ESTUDIANTE' };
    
    if (q) {
      query.$or = [
        { nombre: { $regex: q, $options: 'i' } },
        { apellido: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } }
      ];
    }
    
    const estudiantes = await Usuario.find(query)
      .select('nombre apellido email createdAt')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ apellido: 1, nombre: 1 })
      .lean();
    
    const count = await Usuario.countDocuments(query);
    
    res.json({
      success: true,
      data: estudiantes,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        pages: Math.ceil(count / limit)
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Obtener un usuario por ID (ADMIN)
// @route   GET /api/usuarios/:id
// @access  Private (ADMIN)
exports.getOne = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id).select('-password');
    
    if (!usuario) {
      return res.status(404).json({ 
        success: false, 
        error: 'Usuario no encontrado' 
      });
    }
    
    res.json({ success: true, data: usuario });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Crear usuario (ADMIN)
// @route   POST /api/usuarios
// @access  Private (ADMIN)
exports.create = async (req, res) => {
  try {
    const { nombre, apellido, email, password, rol } = req.body;
    
    const existeEmail = await Usuario.findOne({ email });
    if (existeEmail) {
      return res.status(400).json({ 
        success: false, 
        error: 'El email ya está registrado' 
      });
    }
    
    const usuario = await Usuario.create({
      nombre,
      apellido,
      email,
      password,
      rol
    });
    
    const usuarioSinPassword = await Usuario.findById(usuario._id).select('-password');
    
    res.status(201).json({ success: true, data: usuarioSinPassword });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Actualizar usuario (ADMIN)
// @route   PATCH /api/usuarios/:id
// @access  Private (ADMIN)
exports.update = async (req, res) => {
  try {
    const { nombre, apellido, email, rol } = req.body;
    
    let usuario = await Usuario.findById(req.params.id);
    
    if (!usuario) {
      return res.status(404).json({ 
        success: false, 
        error: 'Usuario no encontrado' 
      });
    }
    
    // Verificar email único si se está cambiando
    if (email && email !== usuario.email) {
      const existeEmail = await Usuario.findOne({ email });
      if (existeEmail) {
        return res.status(400).json({ 
          success: false, 
          error: 'El email ya está en uso' 
        });
      }
    }
    
    usuario = await Usuario.findByIdAndUpdate(
      req.params.id,
      { nombre, apellido, email, rol },
      { new: true, runValidators: true }
    ).select('-password');
    
    res.json({ success: true, data: usuario });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Eliminar usuario (ADMIN)
// @route   DELETE /api/usuarios/:id
// @access  Private (ADMIN)
exports.remove = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id);
    
    if (!usuario) {
      return res.status(404).json({ 
        success: false, 
        error: 'Usuario no encontrado' 
      });
    }
    
    // No permitir eliminar al propio usuario
    if (usuario._id.toString() === req.usuario._id.toString()) {
      return res.status(400).json({ 
        success: false, 
        error: 'No puedes eliminar tu propio usuario' 
      });
    }
    
    await Usuario.findByIdAndDelete(req.params.id);
    
    res.json({ 
      success: true, 
      message: 'Usuario eliminado exitosamente',
      data: {} 
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
// (sin cambios de lógica; los checks de rol se aplican en las rutas con authorize('ADMINISTRADOR'))
