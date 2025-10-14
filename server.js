require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

const CONSUMER_KEY = process.env.PESAPAL_CONSUMER_KEY;
const CONSUMER_SECRET = process.env.PESAPAL_CONSUMER_SECRET;
const CALLBACK_URL = process.env.CALLBACK_URL; // https://echofemme1thankyou.edgeone.app/

// Root route to check if server is running
app.get('/', (req, res) => {
  res.send('Backend is running ✅');
});

// Create Payment endpoint
app.get('/create-payment', (req, res) => {
  const { platform, service, amount, units } = req.query;

  if (!platform || !service || !amount) {
    return res.status(400).send('Missing payment data');
  }

  try {
    // 1️⃣ Generate a unique reference for this order
    const reference = `order_${Date.now()}`;

    // 2️⃣ Build a payload (for future PesaPal integration)
    const paymentData = {
      amount: amount,
      currency: 'KES',
      description: `${platform} ${service}`,
      type: 'MERCHANT',
      reference: reference,
      first_name: 'Customer',
      last_name: 'Name',
      email: 'customer@example.com',
      phone_number: '254700000000',
      callback_url: CALLBACK_URL
    };

    console.log('Payment requested:', paymentData);

    // 3️⃣ For now: redirect user to thank-you page
    res.redirect(CALLBACK_URL);

  } catch (err) {
    console.error('Error creating payment:', err);
    res.status(500).send('Error creating payment');
  }
});

// Start server
app.listen(PORT, () => console.log(`Server running on ${PORT}`));