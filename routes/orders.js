const express = require('express');
const router = express.Router();
const ordersCtrl = require('../controllers/orders');

// GET orders by user_id
router.get('/:user_id', ordersCtrl.getOrdersByUserId);

// POST create a new order
router.post('/:user_id/:order_id', ordersCtrl.createOrder);

// PUT update an existing order by ID
router.put('/:user_id/:order_id', ordersCtrl.updateOrder);

// DELETE an order by ID
router.delete('/:user_id/:order_id', ordersCtrl.deleteOrder);

module.exports = router;
