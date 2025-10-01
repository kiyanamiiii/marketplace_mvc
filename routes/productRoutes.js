// routes/productRoutes.js
const express = require('express');
const router = express.Router();
const productCtrl = require('../controllers/productController');

router.get('/', productCtrl.list);
router.get('/:id', productCtrl.get);
router.post('/', productCtrl.create);
router.put('/:id', productCtrl.update);
router.delete('/:id', productCtrl.remove);
router.post('/checkout', productCtrl.checkout);

module.exports = router;
