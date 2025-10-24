const express = require('express');
const router = express.Router();
const {
  getPerfil,
  updatePerfil,
  cambiarPassword,
  list,
  listEstudiantes,
  getOne,
  create,
  update,
  remove
} = require('../controllers/usuariosController');
const { protect, authorize } = require('../middlewares/auth');

router.use(protect);

// Rutas de perfil (todos los usuarios autenticados)
router.get('/perfil', getPerfil);
router.patch('/perfil', updatePerfil);
router.patch('/cambiar-password', cambiarPassword);

// Rutas solo para ADMINISTRADOR
router.get('/estudiantes', authorize('ADMINISTRADOR'), listEstudiantes);
router.get('/', authorize('ADMINISTRADOR'), list);
router.post('/', authorize('ADMINISTRADOR'), create);
router.get('/:id', authorize('ADMINISTRADOR'), getOne);
router.patch('/:id', authorize('ADMINISTRADOR'), update);
router.delete('/:id', authorize('ADMINISTRADOR'), remove);

module.exports = router;
