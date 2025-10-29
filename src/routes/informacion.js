const express = require('express');
const router = express.Router({ mergeParams: true });
const { 
  list,
  getOne, 
  getByTema,
  create, 
  update, 
  remove,
  getResumen,
  getContextoLLM,
  incrementarEjercicios
} = require('../controllers/informacionController');
const { protect, authorize } = require('../middlewares/auth');

router.use(protect);

// Rutas generales de información
router.route('/')
  .get(list) // GET /api/informacion - Lista toda la información
  .post(authorize('ADMIN'), create); // POST /api/informacion - Crear (requiere tema en body)

router.route('/:id')
  .get(getOne) // GET /api/informacion/:id
  .patch(authorize('ADMIN'), update) // PATCH /api/informacion/:id  
  .delete(authorize('ADMIN'), remove); // DELETE /api/informacion/:id

// Rutas específicas de información
router.get('/:id/resumen', getResumen); // GET /api/informacion/:id/resumen
router.get('/:id/contexto-llm', getContextoLLM); // GET /api/informacion/:id/contexto-llm
router.post('/:id/incrementar-ejercicios', authorize('ADMIN'), incrementarEjercicios); // POST /api/informacion/:id/incrementar-ejercicios

// Ruta para información por tema (cuando se accede como /api/temas/:temaId/informacion)
router.route('/tema/:temaId')
  .get(getByTema) // GET /api/temas/:temaId/informacion
  .post(authorize('ADMIN'), create); // POST /api/temas/:temaId/informacion

module.exports = router;