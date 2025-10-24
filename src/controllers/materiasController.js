const mongoose = require('mongoose');
const Materia = require('../models/Materia');
const Unidad = require('../models/Unidad');
const Tema = require('../models/Tema');
const Ejercicio = require('../models/Ejercicio');

// @desc    Listar materias
// @route   GET /api/materias
// @access  Private
exports.list = async (req, res) => {
  try {
    const { page = 1, limit = 10, activo, q } = req.query;
    const query = {};
    
    if (activo !== undefined) {
      query.activo = activo === 'true';
    }
    
    if (q) {
      query.$text = { $search: q };
    }
    
    const materias = await Materia.find(query)
      .populate('autor', 'nombre apellido email')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 })
      .lean();
    
    const count = await Materia.countDocuments(query);
    
    res.json({
      success: true,
      data: materias,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        pages: Math.ceil(count / limit)
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Obtener una materia
// @route   GET /api/materias/:id
// @access  Private
exports.getOne = async (req, res) => {
  try {
    const materia = await Materia.findById(req.params.id)
      .populate('autor', 'nombre apellido email');
    
    if (!materia) {
      return res.status(404).json({ success: false, error: 'Materia no encontrada' });
    }
    
    res.json({ success: true, data: materia });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Obtener materia con jerarquía completa
// @route   GET /api/materias/:id/full
// @access  Private
exports.getMateriaFull = async (req, res) => {
  try {
    const materiaId = new mongoose.Types.ObjectId(req.params.id);
    
    const pipeline = [
      { $match: { _id: materiaId } },
      {
        $lookup: {
          from: 'usuarios',
          localField: 'autor',
          foreignField: '_id',
          as: 'autor'
        }
      },
      { $unwind: { path: '$autor', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'unidades',
          let: { materiaId: '$_id' },
          pipeline: [
            { $match: { $expr: { $and: [
              { $eq: ['$materia', '$$materiaId'] },
              { $eq: ['$activo', true] }
            ]}}},
            { $sort: { numero: 1 } },
            {
              $lookup: {
                from: 'temas',
                let: { unidadId: '$_id' },
                pipeline: [
                  { $match: { $expr: { $and: [
                    { $eq: ['$unidad', '$$unidadId'] },
                    { $eq: ['$activo', true] }
                  ]}}},
                  { $sort: { orden: 1 } },
                  {
                    $lookup: {
                      from: 'ejercicios',
                      let: { temaId: '$_id' },
                      pipeline: [
                        { $match: { $expr: { $and: [
                          { $eq: ['$tema', '$$temaId'] },
                          { $eq: ['$activo', true] }
                        ]}}},
                        { $sort: { numeroEjercicio: 1 } },
                        {
                          $project: {
                            titulo: 1,
                            enunciado: 1,
                            tipo: 1,
                            opciones: 1,
                            dificultad: 1,
                            numeroEjercicio: 1,
                            puntaje: 1
                          }
                        }
                      ],
                      as: 'ejercicios'
                    }
                  },
                  {
                    $addFields: {
                      totalEjercicios: { $size: '$ejercicios' }
                    }
                  }
                ],
                as: 'temas'
              }
            },
            {
              $addFields: {
                totalTemas: { $size: '$temas' }
              }
            }
          ],
          as: 'unidades'
        }
      },
      {
        $addFields: {
          totalUnidades: { $size: '$unidades' }
        }
      },
      {
        $project: {
          'autor.password': 0,
          'autor.resetPasswordToken': 0,
          'autor.resetPasswordExpire': 0
        }
      }
    ];
    
    const result = await Materia.aggregate(pipeline);
    
    if (!result || result.length === 0) {
      return res.status(404).json({ success: false, error: 'Materia no encontrada' });
    }
    
    const materia = result[0];
    
    res.json({ success: true, data: materia });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Crear materia simple
// @route   POST /api/materias
// @access  Private (ADMIN/PROFESOR)
exports.create = async (req, res) => {
  try {
    const { nombre, descripcion, color, icono } = req.body;
    
    const materia = await Materia.create({
      nombre,
      descripcion,
      color,
      icono,
      autor: req.usuario._id
    });
    
    res.status(201).json({ success: true, data: materia });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Crear materia con estructura completa (sin transacciones para compatibilidad)
// @route   POST /api/materias/full
// @access  Private (ADMIN/PROFESOR)
exports.createMateriaFull = async (req, res) => {
  try {
    const { nombre, descripcion, color, icono, unidades = [] } = req.body;
    
    // Crear la materia
    const materia = await Materia.create({
      nombre,
      descripcion,
      color,
      icono,
      autor: req.usuario._id
    });
    
    const materiaId = materia._id;
    
    // Crear unidades, temas y ejercicios de forma secuencial
    for (const unidadData of unidades) {
      const unidad = await Unidad.create({
        materia: materiaId,
        numero: unidadData.numero,
        titulo: unidadData.titulo,
        descripcion: unidadData.descripcion,
        objetivos: unidadData.objetivos
      });
      
      const unidadId = unidad._id;
      
      if (Array.isArray(unidadData.temas)) {
        for (const temaData of unidadData.temas) {
          const tema = await Tema.create({
            unidad: unidadId,
            titulo: temaData.titulo,
            contenido: temaData.contenido,
            orden: temaData.orden || 0,
            duracionEstimada: temaData.duracionEstimada,
            recursos: temaData.recursos
          });
          
          const temaId = tema._id;
          
          if (Array.isArray(temaData.ejercicios) && temaData.ejercicios.length > 0) {
            const ejercicios = temaData.ejercicios.map((ej, idx) => ({
              tema: temaId,
              titulo: ej.titulo,
              enunciado: ej.enunciado,
              tipo: ej.tipo || 'OPCION_MULTIPLE',
              opciones: ej.opciones,
              respuestaCorrecta: ej.respuestaCorrecta,
              explicacion: ej.explicacion,
              dificultad: ej.dificultad || 'MEDIA',
              numeroEjercicio: ej.numeroEjercicio || (idx + 1),
              puntaje: ej.puntaje || 1
            }));
            
            await Ejercicio.insertMany(ejercicios);
          }
        }
      }
    }
    
    const materiaCompleta = await Materia.findById(materiaId).populate('autor', 'nombre apellido email');
    
    res.status(201).json({ 
      success: true, 
      data: materiaCompleta,
      message: 'Materia creada exitosamente con toda su estructura'
    });
  } catch (err) {
    // Si hay error, intentar limpiar la materia creada (best effort)
    if (err.materiaId) {
      await Materia.findByIdAndDelete(err.materiaId).catch(() => {});
    }
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Actualizar materia
// @route   PATCH /api/materias/:id
// @access  Private (ADMIN/PROFESOR propietario)
exports.update = async (req, res) => {
  try {
    let materia = await Materia.findById(req.params.id);
    
    if (!materia) {
      return res.status(404).json({ success: false, error: 'Materia no encontrada' });
    }
    
    const { nombre, descripcion, color, icono, activo } = req.body;
    
    materia = await Materia.findByIdAndUpdate(
      req.params.id,
      { nombre, descripcion, color, icono, activo },
      { new: true, runValidators: true }
    ).populate('autor', 'nombre apellido email');
    
    res.json({ success: true, data: materia });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Eliminar materia (borrado en cascada)
// @route   DELETE /api/materias/:id
// @access  Private (ADMIN)
exports.remove = async (req, res) => {
  try {
    const materia = await Materia.findById(req.params.id);
    
    if (!materia) {
      return res.status(404).json({ success: false, error: 'Materia no encontrada' });
    }
    
    // Borrado en cascada sin transacciones (compatible con MongoDB standalone)
    // 1. Obtener todas las unidades de la materia
    const unidades = await Unidad.find({ materia: req.params.id });
    const unidadIds = unidades.map(u => u._id);
    
    if (unidadIds.length > 0) {
      // 2. Obtener todos los temas de esas unidades
      const temas = await Tema.find({ unidad: { $in: unidadIds } });
      const temaIds = temas.map(t => t._id);
      
      if (temaIds.length > 0) {
        // 3. Eliminar todos los ejercicios de esos temas
        await Ejercicio.deleteMany({ tema: { $in: temaIds } });
      }
      
      // 4. Eliminar todos los temas
      await Tema.deleteMany({ unidad: { $in: unidadIds } });
    }
    
    // 5. Eliminar todas las unidades
    await Unidad.deleteMany({ materia: req.params.id });
    
    // 6. Finalmente eliminar la materia
    await Materia.findByIdAndDelete(req.params.id);
    
    res.json({ 
      success: true, 
      message: 'Materia y todo su contenido eliminados exitosamente',
      data: {} 
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
