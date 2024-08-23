const ordersModel = require('../models/orders');

module.exports = {
  getOrdersByUserId,
  createOrder,
  updateOrder,
  deleteOrder
};

// Fetch orders by user ID
async function getOrdersByUserId(req, res) {
  try {
    const orders = await ordersModel.getOrdersByUserId(req.params.user_id);
    // Return only the array of order IDs
    res.json({ orderIds: orders.map(order => order._id) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Create a new order
async function createOrder(req, res) {
  try {
    // Check if an order already exists for the user
    let userOrder = await ordersModel.getOrdersByUserId(req.body.userId);

    if (!userOrder || userOrder.length === 0) {
      // Create a new order if none exists
      userOrder = await ordersModel.createOrder({
        userId: req.body.userId,
        orderIds: [req.body.invoiceNumber]
      });
    } else {
      // Update the existing order with a new invoiceNumber
      userOrder[0].orderIds.push(req.body.invoiceNumber);
      userOrder = await ordersModel.updateOrder(userOrder[0]._id, {
        orderIds: userOrder[0].orderIds
      });
    }

    res.status(201).json(userOrder);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Update an existing order (push new order ID)
async function updateOrder(req, res) {
  try {
    const userOrder = await ordersModel.getOrdersByUserId(req.params.user_id);

    if (!userOrder || userOrder.length === 0) {
      return res.status(404).json({ message: 'UserOrder not found' });
    }

    // Push the new order ID into the orderIds array
    userOrder[0].orderIds.push(req.body.invoiceNumber);
    const updatedUserOrder = await ordersModel.updateOrder(userOrder[0]._id, {
      orderIds: userOrder[0].orderIds
    });

    res.json(updatedUserOrder);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Delete an order by user ID and order ID
async function deleteOrder(req, res) {
  try {
    const updatedOrder = await ordersModel.deleteOrder(req.params.user_id, req.params.order_id);
    res.json(updatedOrder);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
