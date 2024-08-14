const ordersDao = require('../daos/orders');

module.exports = {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder
};

async function getAllOrders() {
  return await ordersDao.find({});
}

async function getOrderById(orderId) {
  return await ordersDao.findById(orderId);
}

async function createOrder(orderData) {
  return await ordersDao.create(orderData);
}

async function updateOrder(orderId, orderData) {
  return await ordersDao.findByIdAndUpdate(orderId, orderData, { new: true });
}

async function deleteOrder(orderId) {
  return await ordersDao.findByIdAndDelete(orderId);
}
