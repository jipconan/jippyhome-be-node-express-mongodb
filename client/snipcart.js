const express = require('express');
const router = express.Router();
const axios = require('axios'); // Ensure axios is installed
const dotenv = require('dotenv');

dotenv.config();

// Fetch Snipcart API Key
router.get('/key', (req, res) => {
  try {
    const apiKey = process.env.SNIPCART_API_KEY;
    if (!apiKey) {
      return res.status(404).json({ error: 'Snipcart API key not found' });
    }
    res.json({ apiKey });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Fetch Snipcart Product Data by ID
router.get('/products/id/:product_id', async (req, res) => {
  try {
    const { product_id } = req.params;
    const response = await axios.get(`https://app.snipcart.com/api/products/id/${product_id}`, {
      headers: {
        'Authorization': `Bearer ${process.env.SNIPCART_API_KEY}` // Include your Snipcart API key
      }
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error('Error fetching product data:', error.message);
    res.status(error.response?.status || 500).json({
      message: 'Error fetching product data',
      details: error.response?.data || 'Internal Server Error',
    });
  }
});

// Fetch Snipcart Order Data by ID
router.get('/orders/id/:order_id', async (req, res) => {
  try {
    const { order_id } = req.params;
    const response = await axios.get(`https://app.snipcart.com/api/orders/id/${order_id}`, {
      headers: {
        'Authorization': `Bearer ${process.env.SNIPCART_API_KEY}` // Include your Snipcart API key
      }
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error('Error fetching order data:', error.message);
    res.status(error.response?.status || 500).json({
      message: 'Error fetching order data',
      details: error.response?.data || 'Internal Server Error',
    });
  }
});

module.exports = router;
