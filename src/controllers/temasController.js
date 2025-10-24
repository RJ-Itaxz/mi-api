const mongoose = require('mongoose');
const Tema = require('../models/Tema');
const Unidad = require('../models/Unidad');
const Ejercicio = require('../models/Ejercicio');

exports.listByUnidad = async (req, res) => {
  try {
    const { unidadId } = req.params;
    
    const unidad = await Unidad.findById(unidadId);
    if (!unidad) {
      return res.status(404).json({ success: false, error: 'Unidad no encontrada' });
    }
    
    const temas = await Tema.find({ unidad: unidadId, activo: true })
      .sort({ orden: 1 })
      .lean();
    
    res.json({ success: true, data: temas, count: temas.length });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getOne = async (req, res) => {
  try {
    const tema = await Tema.findById(req.params.id)
      .populate({
        path: 'unidad',
        populate: { path: 'materia', select: 'nombre descripcion' }
      });
    
    if (!tema) {
      return res.status(404).json({ success: false, error: 'Tema no encontrado' });
    }
    
    res.json({ success: true, data: tema });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { unidadId } = req.params;
    const { titulo, contenido, orden, duracionEstimada, recursos } = req.body;
    const unidad = await Unidad.findById(unidadId).populate('materia');
    if (!unidad) return res.status(404).json({ success: false, error: 'Unidad no encontrada' });
    
    const tema = await Tema.create({ unidad: unidadId, titulo, contenido, orden, duracionEstimada, recursos });
    res.status(201).json({ success: true, data: tema });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    let tema = await Tema.findById(req.params.id).populate({ path: 'unidad', populate: { path: 'materia' } });
    if (!tema) return res.status(404).json({ success: false, error: 'Tema no encontrado' });
    
    const { titulo, contenido, orden, duracionEstimada, recursos, activo } = req.body;
    
    tema = await Tema.findByIdAndUpdate(
      req.params.id,
      { titulo, contenido, orden, duracionEstimada, recursos, activo },
      { new: true, runValidators: true }
    );
    
    res.json({ success: true, data: tema });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const tema = await Tema.findById(req.params.id).populate({ path: 'unidad', populate: { path: 'materia' } });
    
    if (!tema) {
      return res.status(404).json({ success: false, error: 'Tema no encontrado' });
    }
    
    // Borrado en cascada sin transacciones (compatible con MongoDB standalone)
    // 1. Eliminar todos los ejercicios del tema
    await Ejercicio.deleteMany({ tema: req.params.id });
    
    // 2. Eliminar el tema
    await Tema.findByIdAndDelete(req.params.id);
    
    res.json({ 
      success: true, 
      message: 'Tema y sus ejercicios eliminados exitosamente',
      data: {} 
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
