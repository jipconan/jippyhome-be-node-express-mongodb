// routes/snipcart.js
const express = require('express');
const router = express.Router();
const dotenv = require('dotenv');

dotenv.config();

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

// Function to verify Snipcart request token
async function verifyRequestToken(token) {
  try {
    const response = await fetch(`https://app.snipcart.com/api/requestvalidation/${token}`);
    if (!response.ok) {
      throw new Error('Token validation failed');
    }
    return response.json();
  } catch (error) {
    console.error('Error verifying request token:', error);
    return null;
  }
}

// Endpoint to handle Snipcart webhook notifications
router.post('/webhook', async (req, res) => {
  try {
    const token = req.headers['x-snipcart-requesttoken'];
    if (!token) {
      return res.status(401).json({ error: 'Missing request token' });
    }

    const isValid = await verifyRequestToken(token);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid request token' });
    }

    const event = req.body;
    if (event.event === 'order.completed') {
      const invoiceNumber = event.content.invoice_number;

      // Return the invoice number to confirm successful processing
      res.json({ message: 'Webhook received', invoiceNumber });
    } else {
      res.sendStatus(400); // Bad request if event type is not handled
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
