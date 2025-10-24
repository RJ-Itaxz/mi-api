const mongoose = require('mongoose');
const Unidad = require('../models/Unidad');
const Materia = require('../models/Materia');
const Tema = require('../models/Tema');
const Ejercicio = require('../models/Ejercicio');

exports.listByMateria = async (req, res) => {
  try {
    const { materiaId } = req.params;
    
    const materia = await Materia.findById(materiaId);
    if (!materia) {
      return res.status(404).json({ success: false, error: 'Materia no encontrada' });
    }
    
    const unidades = await Unidad.find({ materia: materiaId, activo: true })
      .sort({ numero: 1 })
      .lean();
    
    res.json({ success: true, data: unidades, count: unidades.length });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getOne = async (req, res) => {
  try {
    const unidad = await Unidad.findById(req.params.id)
      .populate('materia', 'nombre descripcion');
    
    if (!unidad) {
      return res.status(404).json({ success: false, error: 'Unidad no encontrada' });
    }
    
    res.json({ success: true, data: unidad });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { materiaId } = req.params;
    const { numero, titulo, descripcion, objetivos } = req.body;
    const materia = await Materia.findById(materiaId);
    if (!materia) return res.status(404).json({ success: false, error: 'Materia no encontrada' });
    
    const unidad = await Unidad.create({ materia: materiaId, numero, titulo, descripcion, objetivos });
    res.status(201).json({ success: true, data: unidad });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ 
        success: false, 
        error: 'Ya existe una unidad con ese número en esta materia' 
      });
    }
    res.status(400).json({ success: false, error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    let unidad = await Unidad.findById(req.params.id).populate('materia');
    if (!unidad) return res.status(404).json({ success: false, error: 'Unidad no encontrada' });
    
    const { numero, titulo, descripcion, objetivos, activo } = req.body;
    
    unidad = await Unidad.findByIdAndUpdate(
      req.params.id,
      { numero, titulo, descripcion, objetivos, activo },
      { new: true, runValidators: true }
    );
    
    res.json({ success: true, data: unidad });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const unidad = await Unidad.findById(req.params.id).populate('materia');
    
    if (!unidad) {
      return res.status(404).json({ success: false, error: 'Unidad no encontrada' });
    }
    
    // Borrado en cascada sin transacciones (compatible con MongoDB standalone)
    // 1. Obtener todos los temas de la unidad
    const temas = await Tema.find({ unidad: req.params.id });
    const temaIds = temas.map(t => t._id);
    
    if (temaIds.length > 0) {
      // 2. Eliminar todos los ejercicios de esos temas
      await Ejercicio.deleteMany({ tema: { $in: temaIds } });
    }
    
    // 3. Eliminar todos los temas
    await Tema.deleteMany({ unidad: req.params.id });
    
    // 4. Finalmente eliminar la unidad
    await Unidad.findByIdAndDelete(req.params.id);
    
    res.json({ 
      success: true, 
      message: 'Unidad y todo su contenido eliminados exitosamente',
      data: {} 
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
