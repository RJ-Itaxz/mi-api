const express = require('express');
const Usuario = require('../models/Usuario');
const Resultado = require('../models/Resultado');
const { authMiddleware, selfOrAdmin } = require('../middlewares/auth');

const router = express.Router();

// GET /api/alumnos/:id - perfil y estadísticas (propio o admin)
router.get('/:id', authMiddleware, selfOrAdmin('id'), async (req, res) => {
  try {
    const alumno = await Usuario.findById(req.params.id).select('-password');
    if (!alumno) return res.status(404).json({ success: false, error: 'Alumno no encontrado' });

    const agg = await Resultado.aggregate([
      { $match: { alumno: alumno._id } },
      { $group: { _id: '$alumno', puntos: { $sum: '$puntaje' }, correctos: { $sum: { $cond: ['$correcto', 1, 0] } }, intentos: { $sum: 1 } } }
    ]);

    const stats = agg[0] || { puntos: 0, correctos: 0, intentos: 0 };

    res.json({ success: true, data: { alumno, stats } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/alumnos/:id/ranking - ranking del alumno
router.get('/:id/ranking', authMiddleware, selfOrAdmin('id'), async (req, res) => {
  try {
    const pipeline = [
      { $group: { _id: '$alumno', puntos: { $sum: '$puntaje' } } },
      { $sort: { puntos: -1 } }
    ];
    const ranking = await Resultado.aggregate(pipeline);
    const index = ranking.findIndex(r => String(r._id) === req.params.id);
    const posicion = index >= 0 ? index + 1 : null;
    res.json({ success: true, data: { posicion, total: ranking.length } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/alumnos/:id/resultados - historial (propio o admin)
router.get('/:id/resultados', authMiddleware, selfOrAdmin('id'), async (req, res) => {
  try {
    const resultados = await Resultado.find({ alumno: req.params.id }).populate('ejercicio', 'titulo tema dificultad');
    res.json({ success: true, count: resultados.length, data: resultados });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PATCH /api/alumnos/:id - editar (propio o admin)
router.patch('/:id', authMiddleware, selfOrAdmin('id'), async (req, res) => {
  try {
    const { nombre, email, perfil } = req.body;
    const actualizado = await Usuario.findByIdAndUpdate(
      req.params.id,
      { $set: { nombre, email, perfil } },
      { new: true, runValidators: true }
    ).select('-password');

    if (!actualizado) return res.status(404).json({ success: false, error: 'Alumno no encontrado' });

    res.json({ success: true, data: actualizado });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
