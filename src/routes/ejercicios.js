const express = require('express');
const Ejercicio = require('../models/Ejercicio');
const { authMiddleware, authorizeRoles } = require('../middlewares/auth');

const router = express.Router();

// GET /api/ejercicios?tema=...&dificultad=...&page=1&limit=10
router.get('/', async (req, res) => {
  try {
    const { tema, dificultad, page = 1, limit = 10, q } = req.query;
    const filter = { activo: true };
    if (tema) filter.tema = tema;
    if (dificultad) filter.dificultad = dificultad;
    if (q) filter.titulo = { $regex: q, $options: 'i' };

    const skip = (Number(page) - 1) * Number(limit);
    const [items, total] = await Promise.all([
      Ejercicio.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Ejercicio.countDocuments(filter)
    ]);

    res.json({ success: true, data: items, page: Number(page), limit: Number(limit), total });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/ejercicios/numero/:numero
router.get('/numero/:numero', async (req, res) => {
  try {
    const numero = parseInt(req.params.numero);
    
    if (isNaN(numero)) {
      return res.status(400).json({
        success: false,
        error: 'El número de ejercicio debe ser un número válido'
      });
    }

    const ejercicio = await Ejercicio.findOne({ numeroEjercicio: numero });

    if (!ejercicio) {
      return res.status(404).json({
        success: false,
        error: `Ejercicio #${numero} no encontrado`
      });
    }

    res.json({
      success: true,
      data: ejercicio
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET /api/ejercicios/:id
router.get('/:id', async (req, res) => {
  try {
    const item = await Ejercicio.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, error: 'No encontrado' });
    res.json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/ejercicios (ADMIN)
router.post('/', authMiddleware, authorizeRoles('ADMIN'), async (req, res) => {
  try {
    const { titulo, tema, dificultad, descripcion } = req.body;
    const nuevo = await Ejercicio.create({ titulo, tema, dificultad, descripcion, autor: req.user._id });
    res.status(201).json({ success: true, data: nuevo });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT /api/ejercicios/:id (ADMIN)
router.put('/:id', authMiddleware, authorizeRoles('ADMIN'), async (req, res) => {
  try {
    const { titulo, tema, dificultad, descripcion, activo } = req.body;
    const editado = await Ejercicio.findByIdAndUpdate(
      req.params.id,
      { titulo, tema, dificultad, descripcion, activo },
      { new: true, runValidators: true }
    );
    if (!editado) return res.status(404).json({ success: false, error: 'No encontrado' });
    res.json({ success: true, data: editado });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/ejercicios/:id (ADMIN)
router.delete('/:id', authMiddleware, authorizeRoles('ADMIN'), async (req, res) => {
  try {
    const eliminado = await Ejercicio.findByIdAndDelete(req.params.id);
    if (!eliminado) return res.status(404).json({ success: false, error: 'No encontrado' });
    res.json({ success: true, message: 'Eliminado' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
