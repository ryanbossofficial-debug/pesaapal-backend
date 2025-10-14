import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 5000;

const CONSUMER_KEY = process.env.PESAPAL_CONSUMER_KEY;
const CONSUMER_SECRET = process.env.PESAPAL_CONSUMER_SECRET;

// Your thank-you page
const CALLBACK_URL = 'https://echofemme1thankyou.edgeone.app/';

// Endpoint to create payment
app.get('/create-payment', async (req, res) => {
  const { platform, service, amount, units } = req.query;

  if (!platform || !service || !amount || !units) {
    return res.status(400).json({ error: 'Missing parameters' });
  }

  try {
    // Payment data for PesaPal
    const paymentData = {
      amount,
      description: `${platform} ${service} (${units} units)`,
      callback_url: CALLBACK_URL
    };

    // Send request to PesaPal (sandbox or live)
    const response = await fetch('https://pay.pesapal.com/v3/api/Transactions/SubmitOrderRequest', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CONSUMER_KEY}:${CONSUMER_SECRET}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(paymentData)
    });

    if (!response.ok) throw new Error('Failed to create payment');

    const data = await response.json();

    // Redirect user to PesaPal checkout URL
    const checkoutUrl = data.checkout_url;
    res.redirect(checkoutUrl);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create payment' });
  }
});

app.listen(PORT, () => {
  console.log(`Pesapal backend running on port ${PORT} ✅`);
});