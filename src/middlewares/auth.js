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
    // Compatibilidad: algunos controladores usan req.user y otros req.usuario
    req.user = user; // user sin password
    req.usuario = user; // alias para compatibilidad con controladores existentes
    next();
  } catch (err) {
    return res.status(401).json({ success: false, error: 'Token inválido o expirado' });
  }
}

// Autorización por roles
function authorizeRoles(...rolesPermitidos) {
  // Normaliza roles de rutas: 'ADMINISTRADOR' -> 'ADMIN', 'ESTUDIANTE' -> 'ALUMNO', 'PROFESOR' -> 'ADMIN'
  const normalize = (r) => {
    if (!r) return r;
    const up = String(r).toUpperCase();
    if (up === 'ADMINISTRADOR' || up === 'PROFESOR') return 'ADMIN';
    if (up === 'ESTUDIANTE') return 'ALUMNO';
    return up;
  };
  const roles = rolesPermitidos.map(normalize);
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'No autenticado' });
    }
    if (!roles.includes(req.user.role)) {
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

// Alias para compatibilidad con rutas existentes
const protect = authMiddleware;
const authorize = (...roles) => authorizeRoles(...roles);

module.exports = { authMiddleware, authorizeRoles, selfOrAdmin, protect, authorize };
