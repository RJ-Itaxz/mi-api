const Informacion = require('../models/Informacion');
const Tema = require('../models/Tema');
const Ejercicio = require('../models/Ejercicio');

// GET /api/informacion - Listar toda la información
exports.list = async (req, res) => {
  try {
    const { dificultad, activo } = req.query;
    
    const query = {};
    if (dificultad) query.dificultad = dificultad.toUpperCase();
    if (activo !== undefined) query.activo = activo === 'true';
    
    const informacion = await Informacion.find(query)
      .populate({
        path: 'tema',
        populate: {
          path: 'unidad',
          populate: { path: 'materia', select: 'nombre color' }
        }
      })
      .sort({ 'tema.unidad.materia.nombre': 1, 'tema.unidad.numero': 1, 'tema.orden': 1 })
      .lean();
    
    res.json({ success: true, data: informacion, count: informacion.length });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// GET /api/informacion/:id - Obtener información específica
exports.getOne = async (req, res) => {
  try {
    const informacion = await Informacion.findById(req.params.id)
      .populate({
        path: 'tema',
        populate: {
          path: 'unidad',
          populate: { path: 'materia', select: 'nombre descripcion color' }
        }
      });
    
    if (!informacion) {
      return res.status(404).json({ success: false, error: 'Información no encontrada' });
    }
    
    res.json({ success: true, data: informacion });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// GET /api/temas/:temaId/informacion - Obtener información por tema
exports.getByTema = async (req, res) => {
  try {
    const { temaId } = req.params;
    
    const tema = await Tema.findById(temaId);
    if (!tema) {
      return res.status(404).json({ success: false, error: 'Tema no encontrado' });
    }
    
    const informacion = await Informacion.findOne({ tema: temaId })
      .populate({
        path: 'tema',
        populate: {
          path: 'unidad',
          populate: { path: 'materia', select: 'nombre descripcion color' }
        }
      });
    
    if (!informacion) {
      return res.status(404).json({ 
        success: false, 
        error: 'No hay información disponible para este tema' 
      });
    }
    
    res.json({ success: true, data: informacion });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// POST /api/temas/:temaId/informacion - Crear información para un tema
exports.create = async (req, res) => {
  try {
    const { temaId } = req.params;
    const { 
      conceptosClave,
      ejemploBreve,
      ejerciciosEjemplo,
      contenidoAdicional,
      recursos,
      dificultad
    } = req.body;
    
    const tema = await Tema.findById(temaId).populate({
      path: 'unidad',
      populate: { path: 'materia' }
    });
    
    if (!tema) {
      return res.status(404).json({ success: false, error: 'Tema no encontrado' });
    }
    
    // Verificar si ya existe información para este tema
    const existeInfo = await Informacion.findOne({ tema: temaId });
    if (existeInfo) {
      return res.status(409).json({ 
        success: false, 
        error: 'Ya existe información para este tema. Use PATCH para actualizar.' 
      });
    }
    
    const informacion = await Informacion.create({
      tema: temaId,
      conceptosClave,
      ejemploBreve,
      ejerciciosEjemplo,
      contenidoAdicional,
      recursos,
      dificultad
    });
    
    // Hacer populate para la respuesta
    await informacion.populate({
      path: 'tema',
      populate: {
        path: 'unidad',
        populate: { path: 'materia', select: 'nombre descripcion color' }
      }
    });
    
    res.status(201).json({ success: true, data: informacion });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// PATCH /api/informacion/:id - Actualizar información
exports.update = async (req, res) => {
  try {
    let informacion = await Informacion.findById(req.params.id);
    
    if (!informacion) {
      return res.status(404).json({ success: false, error: 'Información no encontrada' });
    }
    
    const updates = req.body;
    
    informacion = await Informacion.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).populate({
      path: 'tema',
      populate: {
        path: 'unidad',
        populate: { path: 'materia', select: 'nombre descripcion color' }
      }
    });
    
    res.json({ success: true, data: informacion });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// DELETE /api/informacion/:id - Eliminar información
exports.remove = async (req, res) => {
  try {
    const informacion = await Informacion.findById(req.params.id);
    
    if (!informacion) {
      return res.status(404).json({ success: false, error: 'Información no encontrada' });
    }
    
    // Verificar si hay ejercicios asociados
    const ejerciciosAsociados = await Ejercicio.countDocuments({ informacion: req.params.id });
    if (ejerciciosAsociados > 0) {
      return res.status(409).json({ 
        success: false, 
        error: `No se puede eliminar. Hay ${ejerciciosAsociados} ejercicio(s) asociado(s) a esta información.` 
      });
    }
    
    await Informacion.findByIdAndDelete(req.params.id);
    
    res.json({ 
      success: true, 
      message: 'Información eliminada exitosamente',
      data: {} 
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// GET /api/informacion/:id/resumen - Obtener resumen de conceptos
exports.getResumen = async (req, res) => {
  try {
    const informacion = await Informacion.findById(req.params.id)
      .populate('tema', 'titulo orden');
    
    if (!informacion) {
      return res.status(404).json({ success: false, error: 'Información no encontrada' });
    }
    
    const resumen = informacion.getResumenConceptos();
    
    res.json({ 
      success: true, 
      data: {
        tema: informacion.tema,
        resumen,
        totalConceptos: informacion.conceptosClave.length,
        dificultad: informacion.dificultad
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// GET /api/informacion/:id/contexto-llm - Obtener contexto para LLM
exports.getContextoLLM = async (req, res) => {
  try {
    const informacion = await Informacion.findById(req.params.id)
      .populate({
        path: 'tema',
        populate: {
          path: 'unidad',
          populate: { path: 'materia', select: 'nombre' }
        }
      });
    
    if (!informacion) {
      return res.status(404).json({ success: false, error: 'Información no encontrada' });
    }
    
    const contexto = informacion.getContextoLLM();
    
    res.json({ 
      success: true, 
      data: {
        materia: informacion.tema.unidad.materia.nombre,
        unidad: informacion.tema.unidad.titulo,
        tema: informacion.tema.titulo,
        contexto
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// POST /api/informacion/:id/incrementar-ejercicios - Incrementar contador de ejercicios generados
exports.incrementarEjercicios = async (req, res) => {
  try {
    const informacion = await Informacion.findByIdAndUpdate(
      req.params.id,
      { 
        $inc: { 'estadisticas.ejerciciosGenerados': 1 },
        'estadisticas.ultimaActualizacion': new Date()
      },
      { new: true }
    );
    
    if (!informacion) {
      return res.status(404).json({ success: false, error: 'Información no encontrada' });
    }
    
    res.json({ 
      success: true, 
      data: { 
        ejerciciosGenerados: informacion.estadisticas.ejerciciosGenerados 
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};