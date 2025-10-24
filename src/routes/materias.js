const express = require('express');
const router = express.Router();
const { 
  list, 
  getOne, 
  getMateriaFull, 
  create, 
  createMateriaFull, 
  update, 
  remove 
} = require('../controllers/materiasController');
const { protect, authorize } = require('../middlewares/auth');

router.use(protect);

router.get('/', list);
router.get('/:id', getOne);
router.get('/:id/full', getMateriaFull);

router.post('/', authorize('ADMINISTRADOR'), create);
router.post('/full', authorize('ADMINISTRADOR'), createMateriaFull);
router.patch('/:id', authorize('ADMINISTRADOR'), update);
router.delete('/:id', authorize('ADMINISTRADOR'), remove);

module.exports = router;
