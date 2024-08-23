const express = require('express');
const router = express.Router();
const dotenv = require('dotenv');
const axios = require('axios');

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

router.get('/orders', async (req, res) => {
  // Extract query parameters with defaults
  const { invoiceNumber, offset = 0, limit = 50 } = req.query;
  
  // Debugging: log extracted parameters
  console.log("client - invoiceNumber:", invoiceNumber);
  console.log("client - offset:", offset);
  console.log("client - limit:", limit);

  try {
    const secretKey = process.env.SNIPCART_SECRET_KEY;
    if (!secretKey) {
      return res.status(404).json({ error: 'Snipcart API key not found' });
    }

    // Convert invoiceNumber to array if it's a string
    const invoiceNumbers = Array.isArray(invoiceNumber) ? invoiceNumber : invoiceNumber.split(',');

    // Create an array of promises for each invoiceNumber
    const fetchPromises = invoiceNumbers.map(invoice => {
      // Construct the URL with dynamic query parameters
      const SCARTURL = `https://app.snipcart.com/api/orders?offset=${offset}&limit=${limit}&invoiceNumber=${invoice}`;
      console.log("client - SCARTURL for invoice:", SCARTURL);

      // Return the axios promise for each invoiceNumber
      return axios.get(SCARTURL, {
        headers: {
          'Authorization': `Basic ${Buffer.from(secretKey).toString('base64')}`,
          'Accept': 'application/json'
        }
      });
    });

    // Wait for all promises to resolve
    const responses = await Promise.all(fetchPromises);

    // Combine all responses into a single array
    const combinedData = responses.map(response => response.data);

    // Debugging: log combined data
    console.log("client - combinedData:", combinedData);

    res.json(combinedData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
