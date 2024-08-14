const express = require('express');
const router = express.Router();
const ordersCtrl = require('../controllers/orders');

// GET all orders
router.get('/', ordersCtrl.getOrders);

// GET a single order by ID
router.get('/:order_id', ordersCtrl.getOrderById);

// POST create a new order
router.post('/', ordersCtrl.createOrder);

// PUT update an existing order by ID
router.put('/:order_id', ordersCtrl.updateOrder);

// DELETE an order by ID
router.delete('/:order_id', ordersCtrl.deleteOrder);

module.exports = router;
