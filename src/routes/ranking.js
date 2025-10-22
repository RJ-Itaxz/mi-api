const express = require('express');
const Resultado = require('../models/Resultado');
const router = express.Router();

// GET /api/ranking - alias al ranking global
router.get('/', async (req, res) => {
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
