const express = require('express');
const router = express.Router();
const dotenv = require('dotenv');
const axios = require('axios');
const ordersModel = require('../models/orders');
const mongoose = require("mongoose");

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
  // console.log("client - invoiceNumber:", invoiceNumber);
  // console.log("client - offset:", offset);
  // console.log("client - limit:", limit);

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
      // console.log("client - SCARTURL for invoice:", SCARTURL);

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
    // console.log("client - combinedData:", combinedData);

    res.json(combinedData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/// Webhook endpoint
router.post('/webhook', async (req, res) => {
  try {
    const requestToken = req.headers['x-snipcart-requesttoken'];
    if (!requestToken) {
      console.error('Request token missing in headers.');
      return res.status(400).json({ error: 'Request token is missing.' });
    }

    const tokenVerificationUrl = `https://app.snipcart.com/api/requestvalidation/${requestToken}`;
    
    try {
      const tokenValidationResponse = await axios.get(tokenVerificationUrl, {
        headers: {
          'Authorization': `Basic ${Buffer.from(process.env.SNIPCART_SECRET_KEY).toString('base64')}`,
        },
      });

      if (tokenValidationResponse.status !== 200) {
        console.error('Token validation failed with status:', tokenValidationResponse.status);
        return res.status(401).json({ error: 'Invalid request token.' });
      }

      console.log('Token is valid.');

      // Check if the event is 'order.completed'
      if (req.body.eventName === 'order.completed') {
        await handleOrderProcessing(req.body.content);  // Pass only the content to the function
      }

      // Send a success response to Snipcart immediately
      res.status(200).json({ message: 'Webhook received and verified.' });

    } catch (tokenError) {
      console.error('Error during token verification:', tokenError.message);
      return res.status(500).json({ error: 'Failed to verify request token.' });
    }

  } catch (error) {
    console.error('Error handling webhook:', error.message);
    return res.status(500).json({ error: 'Failed to process webhook.' });
  }
});

// HELPER FUNCTION
async function handleOrderProcessing(data) {
  try {
    // console.log("data:", data);

    const invoiceNumber = data.invoiceNumber;

    // Ensure the items array exists and is not empty
    if (data.items && data.items.length > 0) {
      // Loop through the items array to find the userId field in customFields
      const userIdField = data.items[0].customFields.find(field => field.name === 'userId');
      
      if (userIdField && userIdField.value) {
             
        // Convert userId from string to ObjectId
        const userId = userIdField.value;
        console.log("check userId:", userId);

        await ordersModel.createOrder({
          body: { 
            invoiceNumber, 
            userId,
          }
        });
    
        console.log('Order processing completed successfully.');
      } else {
        console.error('userId field not found in customFields.');
      }
    } else {
      console.error('No items found in the order.');
    }
    
  } catch (error) {
    console.error('Error processing order:', error.message);
  }
}


module.exports = router;
