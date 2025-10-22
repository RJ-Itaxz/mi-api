const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');
const { authMiddleware } = require('../middlewares/auth');

const router = express.Router();

function signToken(user) {
  const payload = { id: user._id, role: user.role };
  const secret = process.env.JWT_SECRET || 'dev-secret';
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
  return jwt.sign(payload, secret, { expiresIn });
}

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { nombre, email, password, role, perfil, adminCode } = req.body;

    if (!nombre || !email || !password) {
      return res.status(400).json({ success: false, error: 'Faltan campos requeridos' });
    }

    // Restringir creación de ADMIN
    let finalRole = 'ALUMNO';
    if (role === 'ADMIN') {
      if (!adminCode || adminCode !== (process.env.ADMIN_REG_CODE || '')) {
        return res.status(403).json({ success: false, error: 'Código de administrador inválido' });
      }
      finalRole = 'ADMIN';
    }

    const existente = await Usuario.findOne({ email });
    if (existente) {
      return res.status(400).json({ success: false, error: 'El email ya está registrado' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const usuario = await Usuario.create({
      nombre,
      email,
      password: passwordHash,
      role: finalRole,
      perfil
    });

    const token = signToken(usuario);
    const usuarioSeguro = { id: usuario._id, nombre: usuario.nombre, email: usuario.email, role: usuario.role };

    res.status(201).json({ success: true, token, user: usuarioSeguro });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const usuario = await Usuario.findOne({ email });
    if (!usuario) return res.status(400).json({ success: false, error: 'Credenciales inválidas' });

    const ok = await bcrypt.compare(password, usuario.password);
    if (!ok) return res.status(400).json({ success: false, error: 'Credenciales inválidas' });

    const token = signToken(usuario);
    const usuarioSeguro = { id: usuario._id, nombre: usuario.nombre, email: usuario.email, role: usuario.role };
    res.json({ success: true, token, user: usuarioSeguro });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/auth/me
router.get('/me', authMiddleware, async (req, res) => {
  res.json({ success: true, user: req.user });
});

module.exports = router;
