const express = require('express');
const router = express.Router();
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

module.exports = router;
