const Ejercicio = require('../models/Ejercicio');
const Tema = require('../models/Tema');

exports.listByTema = async (req, res) => {
  try {
    const { temaId } = req.params;
    const { dificultad } = req.query;
    
    const tema = await Tema.findById(temaId);
    if (!tema) {
      return res.status(404).json({ success: false, error: 'Tema no encontrado' });
    }
    
    const query = { tema: temaId, activo: true };
    if (dificultad) {
      query.dificultad = dificultad.toUpperCase();
    }
    
    const ejercicios = await Ejercicio.find(query)
      .sort({ numeroEjercicio: 1 })
      .lean();
    
    res.json({ success: true, data: ejercicios, count: ejercicios.length });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getOne = async (req, res) => {
  try {
    const ejercicio = await Ejercicio.findById(req.params.id)
      .populate({
        path: 'tema',
        populate: {
          path: 'unidad',
          populate: { path: 'materia', select: 'nombre' }
        }
      });
    
    if (!ejercicio) {
      return res.status(404).json({ success: false, error: 'Ejercicio no encontrado' });
    }
    
    res.json({ success: true, data: ejercicio });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { temaId } = req.params;
    const { 
      titulo, 
      enunciado, 
      tipo, 
      opciones, 
      respuestaCorrecta, 
      explicacion,
      dificultad, 
      numeroEjercicio,
      puntaje 
    } = req.body;
    
    const tema = await Tema.findById(temaId).populate({
      path: 'unidad',
      populate: { path: 'materia' }
    });
    
    if (!tema) {
      return res.status(404).json({ success: false, error: 'Tema no encontrado' });
    }
    
    const ejercicio = await Ejercicio.create({
      tema: temaId,
      titulo,
      enunciado,
      tipo,
      opciones,
      respuestaCorrecta,
      explicacion,
      dificultad,
      numeroEjercicio,
      puntaje
    });
    
    res.status(201).json({ success: true, data: ejercicio });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    let ejercicio = await Ejercicio.findById(req.params.id).populate({
      path: 'tema',
      populate: {
        path: 'unidad',
        populate: { path: 'materia' }
      }
    });
    
    if (!ejercicio) {
      return res.status(404).json({ success: false, error: 'Ejercicio no encontrado' });
    }
    
    const updates = req.body;
    
    ejercicio = await Ejercicio.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );
    
    res.json({ success: true, data: ejercicio });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const ejercicio = await Ejercicio.findById(req.params.id).populate({
      path: 'tema',
      populate: {
        path: 'unidad',
        populate: { path: 'materia' }
      }
    });
    
    if (!ejercicio) {
      return res.status(404).json({ success: false, error: 'Ejercicio no encontrado' });
    }
    
    await Ejercicio.findByIdAndDelete(req.params.id);
    
    res.json({ 
      success: true, 
      message: 'Ejercicio eliminado exitosamente',
      data: {} 
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
