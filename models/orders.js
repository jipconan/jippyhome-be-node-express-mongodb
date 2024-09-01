const ordersDao = require('../daos/orders');

module.exports = {
  getOrdersByUserId,
  createOrder,
  updateOrder,
  deleteOrder
};

// Fetch orders by user ID
async function getOrdersByUserId(userId) {
  // Returns an array of orders, not just a single order
  return await ordersDao.find({ userId: userId });
}

// Create a new order or update an existing one
async function createOrder(orderData) {
  // Check if an order for the user already exists
  console.log("orderData:", orderData);
  let userOrder = await ordersDao.findOne({ userId: orderData.body.userId });

  if (!userOrder) {
    // Create a new order if none exists, initialize orderIds with the invoiceNumber
    return await ordersDao.create({ 
      userId: orderData.body.userId,  
      orderIds: [orderData.body.invoiceNumber] 
    });
  } else {
    // Update the existing order, ensure orderIds is an array
    userOrder.orderIds.push(orderData.body.invoiceNumber); 
    return await ordersDao.findByIdAndUpdate(userOrder._id, userOrder, { new: true });
  }
}

// Update an existing order with new data
async function updateOrder(orderId, orderData) {
  // Update order by ID
  return await ordersDao.findByIdAndUpdate(orderId, orderData, { new: true });
}

// Delete a specific order ID from the user's orders
async function deleteOrder(userId, orderId) {
  try {
    // Find the user order
    const userOrder = await ordersDao.findOne({ userId });
    if (!userOrder) {
      throw new Error('UserOrder not found');
    }
    
    // Remove the orderId from the orderIds array
    userOrder.orderIds = userOrder.orderIds.filter(id => id !== orderId);
    
    // Save the updated document
    return await ordersDao.findByIdAndUpdate(userOrder._id, userOrder, { new: true });
  } catch (err) {
    throw new Error(`Error deleting order: ${err.message}`);
  }
}
