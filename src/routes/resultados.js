const express = require('express');
const Resultado = require('../models/Resultado');
const Usuario = require('../models/Usuario');
const { authMiddleware, authorizeRoles, selfOrAdmin } = require('../middlewares/auth');

const router = express.Router();

// POST /api/resultados - Registrar resultado (ALUMNO)
router.post('/', authMiddleware, authorizeRoles('ALUMNO','ADMIN'), async (req, res) => {
  try {
    const { ejercicio, correcto, puntaje = 0, tiempoSeg = 0, detalles } = req.body;
    const alumno = req.user._id;
    const creado = await Resultado.create({ alumno, ejercicio, correcto, puntaje, tiempoSeg, detalles });
    res.status(201).json({ success: true, data: creado });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/resultados/mios - resultados del usuario autenticado
router.get('/mios', authMiddleware, async (req, res) => {
  try {
    const resultados = await Resultado.find({ alumno: req.user._id }).populate('ejercicio', 'titulo tema dificultad');
    res.json({ success: true, count: resultados.length, data: resultados });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/ranking - ranking global (topN opcional)
router.get('/ranking', async (req, res) => {
  try {
    const topN = Number(req.query.top) || 10;
    const pipeline = [
      { $group: { _id: '$alumno', puntos: { $sum: '$puntaje' }, correctos: { $sum: { $cond: ['$correcto', 1, 0] } }, intentos: { $sum: 1 } } },
      { $sort: { puntos: -1, correctos: -1 } },
      { $limit: topN },
      { $lookup: { from: 'usuarios', localField: '_id', foreignField: '_id', as: 'alumno' } },
      { $unwind: '$alumno' },
      { $project: { _id: 0, alumnoId: '$alumno._id', nombre: '$alumno.nombre', email: '$alumno.email', puntos: 1, correctos: 1, intentos: 1 } }
    ];
    const ranking = await Resultado.aggregate(pipeline);
    res.json({ success: true, data: ranking });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
