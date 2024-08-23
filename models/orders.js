const ordersDao = require('../daos/orders');

module.exports = {
  getOrdersByUserId,
  createOrder,
  updateOrder,
  deleteOrder
};

async function getOrdersByUserId(userId) {
  return await ordersDao.find({ userId: userId });
}

async function createOrder(orderData) {
  return await ordersDao.create(orderData);
}

async function updateOrder(orderId, orderData) {
  return await ordersDao.findByIdAndUpdate(orderId, orderData, { new: true });
}

async function deleteOrder(userId, orderId) {
  try {
    const userOrder = await ordersDao.findOne({ userId });
    if (!userOrder) {
      throw new Error('UserOrder not found');
    }
    
    // Remove the orderId from the orderIds array
    userOrder.orderIds = userOrder.orderIds.filter(id => id !== orderId);
    
    // Save the updated document
    return await userOrder.save();
  } catch (err) {
    throw new Error(`Error deleting order: ${err.message}`);
  }
}