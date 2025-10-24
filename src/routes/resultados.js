const express = require('express');
const router = express.Router({ mergeParams: true });
const {
  create,
  getMisResultados,
  getMisEstadisticas,
  getResultadosEstudiantes,
  getRanking
} = require('../controllers/resultadosController');
const { protect, authorize } = require('../middlewares/auth');

router.use(protect);

// Rutas para estudiantes
router.post('/', authorize('ESTUDIANTE'), create);
router.get('/mis-resultados', authorize('ESTUDIANTE'), getMisResultados);
router.get('/mis-estadisticas', authorize('ESTUDIANTE'), getMisEstadisticas);

// Rutas para profesores/admin
router.get('/estudiantes', authorize('ADMINISTRADOR'), getResultadosEstudiantes);
router.get('/ranking', authorize('ADMINISTRADOR'), getRanking);

module.exports = router;
