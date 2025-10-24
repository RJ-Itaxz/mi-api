const Resultado = require('../models/Resultado');
const Ejercicio = require('../models/Ejercicio');
const mongoose = require('mongoose');

// @desc    Registrar resultado de ejercicio
// @route   POST /api/ejercicios/:ejercicioId/resultados
// @access  Private (ESTUDIANTE)
exports.create = async (req, res) => {
  try {
    const { ejercicioId } = req.params;
    const { respuestaUsuario, tiempoRespuesta } = req.body;
    
    const ejercicio = await Ejercicio.findById(ejercicioId);
    if (!ejercicio) {
      return res.status(404).json({ success: false, error: 'Ejercicio no encontrado' });
    }
    
    // Verificar si ya existe un resultado para este usuario y ejercicio
    let resultado = await Resultado.findOne({
      usuario: req.usuario._id,
      ejercicio: ejercicioId
    });
    
    // Calcular si es correcto
    let esCorrecto = false;
    if (ejercicio.tipo === 'OPCION_MULTIPLE') {
      const opcionCorrecta = ejercicio.opciones.find(o => o.esCorrecta);
      esCorrecto = respuestaUsuario === opcionCorrecta?.texto;
    } else {
      esCorrecto = respuestaUsuario === ejercicio.respuestaCorrecta;
    }
    
    const puntajeObtenido = esCorrecto ? ejercicio.puntaje : 0;
    
    if (resultado) {
      // Actualizar intento existente
      resultado.respuestaUsuario = respuestaUsuario;
      resultado.esCorrecto = esCorrecto;
      resultado.puntajeObtenido = puntajeObtenido;
      resultado.tiempoRespuesta = tiempoRespuesta;
      resultado.intentos += 1;
      await resultado.save();
    } else {
      // Crear nuevo resultado
      resultado = await Resultado.create({
        usuario: req.usuario._id,
        ejercicio: ejercicioId,
        respuestaUsuario,
        esCorrecto,
        puntajeObtenido,
        tiempoRespuesta,
        intentos: 1
      });
    }
    
    res.status(201).json({ 
      success: true, 
      data: resultado,
      feedback: {
        correcto: esCorrecto,
        explicacion: ejercicio.explicacion
      }
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Obtener resultados de un estudiante
// @route   GET /api/resultados/mis-resultados
// @access  Private (ESTUDIANTE)
exports.getMisResultados = async (req, res) => {
  try {
    const { materiaId, page = 1, limit = 20 } = req.query;
    
    const pipeline = [
      { $match: { usuario: new mongoose.Types.ObjectId(req.usuario._id) } },
      {
        $lookup: {
          from: 'ejercicios',
          localField: 'ejercicio',
          foreignField: '_id',
          as: 'ejercicioData'
        }
      },
      { $unwind: '$ejercicioData' },
      {
        $lookup: {
          from: 'temas',
          localField: 'ejercicioData.tema',
          foreignField: '_id',
          as: 'temaData'
        }
      },
      { $unwind: '$temaData' },
      {
        $lookup: {
          from: 'unidades',
          localField: 'temaData.unidad',
          foreignField: '_id',
          as: 'unidadData'
        }
      },
      { $unwind: '$unidadData' }
    ];
    
    if (materiaId) {
      pipeline.push({
        $match: { 'unidadData.materia': new mongoose.Types.ObjectId(materiaId) }
      });
    }
    
    pipeline.push(
      { $sort: { createdAt: -1 } },
      { $skip: (page - 1) * limit },
      { $limit: parseInt(limit) },
      {
        $project: {
          ejercicio: '$ejercicioData.titulo',
          tema: '$temaData.titulo',
          unidad: '$unidadData.titulo',
          esCorrecto: 1,
          puntajeObtenido: 1,
          tiempoRespuesta: 1,
          intentos: 1,
          createdAt: 1
        }
      }
    );
    
    const resultados = await Resultado.aggregate(pipeline);
    
    res.json({ success: true, data: resultados, count: resultados.length });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Obtener estadísticas del estudiante
// @route   GET /api/resultados/mis-estadisticas
// @access  Private (ESTUDIANTE)
exports.getMisEstadisticas = async (req, res) => {
  try {
    const { materiaId } = req.query;
    
    const matchStage = { usuario: new mongoose.Types.ObjectId(req.usuario._id) };
    
    const stats = await Resultado.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: null,
          totalEjercicios: { $sum: 1 },
          correctos: { $sum: { $cond: ['$esCorrecto', 1, 0] } },
          puntajeTotal: { $sum: '$puntajeObtenido' },
          tiempoPromedio: { $avg: '$tiempoRespuesta' }
        }
      },
      {
        $project: {
          _id: 0,
          totalEjercicios: 1,
          correctos: 1,
          incorrectos: { $subtract: ['$totalEjercicios', '$correctos'] },
          porcentajeAcierto: { 
            $multiply: [
              { $divide: ['$correctos', '$totalEjercicios'] },
              100
            ]
          },
          puntajeTotal: 1,
          tiempoPromedio: { $round: ['$tiempoPromedio', 2] }
        }
      }
    ]);
    
    res.json({ 
      success: true, 
      data: stats.length > 0 ? stats[0] : {
        totalEjercicios: 0,
        correctos: 0,
        incorrectos: 0,
        porcentajeAcierto: 0,
        puntajeTotal: 0,
        tiempoPromedio: 0
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Obtener resultados de todos los estudiantes (PROFESOR/ADMIN)
// @route   GET /api/resultados/estudiantes
// @access  Private (PROFESOR/ADMIN)
exports.getResultadosEstudiantes = async (req, res) => {
  try {
    const { materiaId, estudianteId, page = 1, limit = 50 } = req.query;
    
    const pipeline = [];
    
    const matchStage = {};
    if (estudianteId) {
      matchStage.usuario = new mongoose.Types.ObjectId(estudianteId);
    }
    
    if (Object.keys(matchStage).length > 0) {
      pipeline.push({ $match: matchStage });
    }
    
    pipeline.push(
      {
        $lookup: {
          from: 'usuarios',
          localField: 'usuario',
          foreignField: '_id',
          as: 'estudianteData'
        }
      },
      { $unwind: '$estudianteData' },
      {
        $lookup: {
          from: 'ejercicios',
          localField: 'ejercicio',
          foreignField: '_id',
          as: 'ejercicioData'
        }
      },
      { $unwind: '$ejercicioData' },
      { $sort: { createdAt: -1 } },
      { $skip: (page - 1) * limit },
      { $limit: parseInt(limit) },
      {
        $project: {
          estudiante: {
            nombre: '$estudianteData.nombre',
            apellido: '$estudianteData.apellido',
            email: '$estudianteData.email'
          },
          ejercicio: '$ejercicioData.titulo',
          esCorrecto: 1,
          puntajeObtenido: 1,
          tiempoRespuesta: 1,
          intentos: 1,
          createdAt: 1
        }
      }
    );
    
    const resultados = await Resultado.aggregate(pipeline);
    
    res.json({ success: true, data: resultados, count: resultados.length });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Obtener ranking de estudiantes
// @route   GET /api/resultados/ranking
// @access  Private (PROFESOR/ADMIN)
exports.getRanking = async (req, res) => {
  try {
    const { materiaId, limit = 10 } = req.query;
    
    const ranking = await Resultado.aggregate([
      {
        $group: {
          _id: '$usuario',
          totalPuntos: { $sum: '$puntajeObtenido' },
          totalEjercicios: { $sum: 1 },
          correctos: { $sum: { $cond: ['$esCorrecto', 1, 0] } }
        }
      },
      {
        $lookup: {
          from: 'usuarios',
          localField: '_id',
          foreignField: '_id',
          as: 'usuario'
        }
      },
      { $unwind: '$usuario' },
      {
        $project: {
          nombre: { $concat: ['$usuario.nombre', ' ', '$usuario.apellido'] },
          email: '$usuario.email',
          totalPuntos: 1,
          totalEjercicios: 1,
          correctos: 1,
          porcentajeAcierto: {
            $multiply: [
              { $divide: ['$correctos', '$totalEjercicios'] },
              100
            ]
          }
        }
      },
      { $sort: { totalPuntos: -1 } },
      { $limit: parseInt(limit) }
    ]);
    
    res.json({ success: true, data: ranking });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
