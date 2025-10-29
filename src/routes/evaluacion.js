const express = require('express');
const router = express.Router();
const EvaluacionController = require('../controllers/evaluacionController');
const { protect } = require('../middlewares/auth');

// Middleware de autenticación para todas las rutas
router.use(protect);

/**
 * @route POST /api/evaluacion/ejercicio
 * @desc Evaluar un ejercicio individual con retroalimentación del LLM
 * @body { ejercicioId: ObjectId, respuestaAlumno: String }
 * @returns { evaluacion: Object, resultadoId: ObjectId }
 */
router.post('/ejercicio', EvaluacionController.evaluarEjercicio);

/**
 * @route POST /api/evaluacion/sesion
 * @desc Evaluar una sesión completa de ejercicios
 * @body { ejerciciosResueltos: [{ ejercicioId: ObjectId, respuesta: String }] }
 * @returns { evaluacionSesion: Object, resultadosIds: [ObjectId] }
 */
router.post('/sesion', EvaluacionController.evaluarSesion);

/**
 * @route GET /api/evaluacion/retroalimentacion/:resultadoId
 * @desc Obtener retroalimentación detallada de un resultado específico
 * @param resultadoId - ID del resultado a consultar
 * @returns { resultado: Object }
 */
router.get('/retroalimentacion/:resultadoId', EvaluacionController.obtenerRetroalimentacion);

/**
 * @route GET /api/evaluacion/progreso
 * @desc Obtener análisis de progreso del alumno
 * @query periodo - 'semana', 'mes', 'todo'
 * @returns { analisis: String, estadisticas: Object }
 */
router.get('/progreso', EvaluacionController.obtenerAnalisisProgreso);

module.exports = router;