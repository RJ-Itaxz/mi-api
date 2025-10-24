const express = require('express');
const router = express.Router({ mergeParams: true });
const { 
  listByMateria, 
  getOne, 
  create, 
  update, 
  remove 
} = require('../controllers/unidadesController');
const { protect, authorize } = require('../middlewares/auth');

router.use(protect);

router.route('/')
  .get(listByMateria)
  .post(authorize('ADMINISTRADOR'), create);

router.route('/:id')
  .get(getOne)
  .patch(authorize('ADMINISTRADOR'), update)
  .delete(authorize('ADMINISTRADOR'), remove);

module.exports = router;
