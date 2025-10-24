const express = require('express');
const router = express.Router({ mergeParams: true });
const { 
  listByUnidad, 
  getOne, 
  create, 
  update, 
  remove 
} = require('../controllers/temasController');
const { protect, authorize } = require('../middlewares/auth');

router.use(protect);

router.route('/')
  .get(listByUnidad)
  .post(authorize('ADMINISTRADOR'), create);

router.route('/:id')
  .get(getOne)
  .patch(authorize('ADMINISTRADOR'), update)
  .delete(authorize('ADMINISTRADOR'), remove);

module.exports = router;
