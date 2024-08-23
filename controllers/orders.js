const ordersModel = require('../models/orders');

module.exports = {
  getOrdersByUserId,
  createOrder,
  updateOrder,
  deleteOrder
};

async function getOrdersByUserId(req, res) {
  try {
    const orders = await ordersModel.getOrdersByUserId(req.params.user_id);
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function createOrder(req, res) {
  try {
    // Find the existing UserOrder document
    let userOrder = await ordersModel.getOrdersByUserId(req.params.user_id);
    
    // If not found, create a new UserOrder
    if (!userOrder) {
      userOrder = await ordersModel.createOrder({
        userId: req.params.user_id,
        orderIds: [req.params.order_id]
      });
    } else {
      // Otherwise, add the new order_id
      userOrder.orderIds.push(req.params.order_id);
      userOrder = await userOrder.save();
    }

    res.status(201).json(userOrder);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function updateOrder(req, res) {
  try {
    // Find the existing UserOrder document
    const userOrder = await ordersModel.getOrdersByUserId(req.params.user_id);

    if (!userOrder) {
      return res.status(404).json({ message: 'UserOrder not found' });
    }

    // Push the new order_id into the orderIds array
    userOrder.orderIds.push(req.params.order_id);
    const updatedUserOrder = await userOrder.save();
    
    res.json(updatedUserOrder);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function deleteOrder(req, res) {
  try {
    const { user_id, order_id } = req.params;
    const updatedUserOrder = await ordersModel.deleteOrder(user_id, order_id);
    
    if (!updatedUserOrder) {
      return res.status(404).json({ message: 'UserOrder not found' });
    }
    res.json(updatedUserOrder);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

