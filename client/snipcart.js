const express = require('express');
const router = express.Router();
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

// Endpoint to get the Snipcart API key
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

// Endpoint to fetch orders from Snipcart
router.get('/orders', async (req, res) => {
  try {
    const apiKey = process.env.SNIPCART_API_KEY;
    if (!apiKey) {
      return res.status(404).json({ error: 'Snipcart API key not found' });
    }

    const { offset = 0, limit = 20, placedBy } = req.query; 

    // Construct the URL with query parameters
    const url = new URL('https://app.snipcart.com/api/orders');
    url.searchParams.append('offset', offset.toString());
    url.searchParams.append('limit', limit.toString());
    if (placedBy) {
      url.searchParams.append('placedBy', placedBy); 
    }

    const response = await axios.get(url.toString(), {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Basic ${Buffer.from(apiKey + ':').toString('base64')}`, 
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
