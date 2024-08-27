const express = require('express');
const router = express.Router();
const productsCtrl = require('../controllers/products');
var securityMiddleware = require('../middlewares/security');

// GET all products
router.get('/', productsCtrl.getAllProducts);

// GET a single product by ID
router.get('/:product_id', productsCtrl.getProductById);

// GET a remapped snipcart JSON single product by ID
router.get('/id/:product_id', productsCtrl.getSnipcartProductById);

// GET all products based on CategoryName
router.get('/type/:category_name', productsCtrl.getProductsByCategoryName);

// POST create a new product
router.post('/createproduct',securityMiddleware.checkSignIn, productsCtrl.createProduct);

// PUT update an existing product by ID
router.put('/updateproduct/:product_id',securityMiddleware.checkSignIn, productsCtrl.updateProduct);

// DELETE a product by ID
router.delete('/deleteproduct/:product_id',securityMiddleware.checkSignIn, productsCtrl.deleteProduct);

module.exports = router;
