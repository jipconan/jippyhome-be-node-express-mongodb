const express = require('express');
const router = express.Router();
const ordersCtrl = require('../controllers/orders');
var securityMiddleware = require('../middlewares/security');

// GET orders by user_id
router.get('/:user_id', securityMiddleware.checkSignIn, ordersCtrl.getOrdersByUserId);

// POST create a new order
router.post('/', securityMiddleware.checkSignIn, ordersCtrl.createOrder);

// PUT update orders by user_id (e.g., adding a new orderId to the user's orders)
router.put('/:user_id', securityMiddleware.checkSignIn, ordersCtrl.updateOrder);

module.exports = router;
