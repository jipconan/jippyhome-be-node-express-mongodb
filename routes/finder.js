const express = require('express');
const router = express.Router();
const productsCtrl = require('../controllers/products');

// GET products grouped by subCategory for owner
router.get('/', productsCtrl.getProductsBySubCategory);

module.exports = router;
