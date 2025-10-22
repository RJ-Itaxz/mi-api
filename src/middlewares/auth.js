const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

// Extrae token del header Authorization: Bearer <token>
function getTokenFromHeader(req) {
  const auth = req.headers['authorization'] || '';
  if (!auth.startsWith('Bearer ')) return null;
  return auth.substring(7);
}

// Autenticación: requiere JWT válido
async function authMiddleware(req, res, next) {
  try {
    const token = getTokenFromHeader(req);
    if (!token) {
      return res.status(401).json({ success: false, error: 'No autenticado' });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret');
    const user = await Usuario.findById(payload.id).select('-password');
    if (!user) {
      return res.status(401).json({ success: false, error: 'Token inválido' });
    }
    req.user = user; // user sin password
    next();
  } catch (err) {
    return res.status(401).json({ success: false, error: 'Token inválido o expirado' });
  }
}

// Autorización por roles
function authorizeRoles(...rolesPermitidos) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'No autenticado' });
    }
    if (!rolesPermitidos.includes(req.user.role)) {
      return res.status(403).json({ success: false, error: 'No autorizado' });
    }
    next();
  };
}

// Permite acceso si es el mismo usuario o admin
function selfOrAdmin(paramIdName = 'id') {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ success: false, error: 'No autenticado' });
    if (req.user.role === 'ADMIN' || req.user._id.toString() === (req.params[paramIdName] || '')) {
      return next();
    }
    return res.status(403).json({ success: false, error: 'No autorizado' });
  };
}

module.exports = { authMiddleware, authorizeRoles, selfOrAdmin };
