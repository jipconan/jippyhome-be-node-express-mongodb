const ordersModel = require('../models/orders');

module.exports = {
  getOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder
};

async function getOrders(req, res) {
  try {
    const orders = await ordersModel.getAllOrders();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getOrderById(req, res) {
  try {
    const order = await ordersModel.getOrderById(req.params.order_id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function createOrder(req, res) {
  try {
    const newOrder = await ordersModel.createOrder(req.body);
    res.status(201).json(newOrder);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function updateOrder(req, res) {
  try {
    const updatedOrder = await ordersModel.updateOrder(req.params.order_id, req.body);
    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(updatedOrder);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function deleteOrder(req, res) {
  try {
    const result = await ordersModel.deleteOrder(req.params.order_id);
    if (!result) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json({ message: 'Order deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
