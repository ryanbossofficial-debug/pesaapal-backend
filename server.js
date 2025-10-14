// server.js (ESM)
import express from 'express';
import cors from 'cors';
import crypto from 'crypto';
import fetch from 'node-fetch'; // Needed for API calls
import bodyParser from 'body-parser';

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

// PesaPal credentials (set these in Render environment variables)
const PESAPAL_CONSUMER_KEY = process.env.PESAPAL_CONSUMER_KEY;
const PESAPAL_CONSUMER_SECRET = process.env.PESAPAL_CONSUMER_SECRET;

// Sandbox/live URL
const PESAPAL_URL = 'https://demo.pesapal.com/api/PostPesapalDirectOrderV4'; // Change to live URL when ready
const CALLBACK_URL = 'https://pesaapal-backend.onrender.com/payment-callback';

// Health check
app.get('/', (req, res) => res.send('PesaPal backend running ✅'));

// Create payment endpoint
app.get('/create-payment', async (req, res) => {
  const { platform, service, amount, units } = req.query;

  if (!platform || !service || !amount || !units) {
    return res.status(400).json({ error: 'Missing query parameters' });
  }

  try {
    // Generate unique order reference
    const reference = crypto.randomBytes(6).toString('hex');

    // Build PesaPal payload
    const payload = {
      amount,
      currency: 'KES',
      description: `${platform} ${service} x${units}`,
      type: 'MERCHANT',
      reference,
      callback_url: CALLBACK_URL,
    };

    // Generate OAuth signature (basic example, PesaPal uses OAuth1)
    // For demo we just append params in URL
    const params = new URLSearchParams(payload).toString();
    const paymentUrl = `${PESAPAL_URL}?${params}`;

    // Return payment URL
    res.json({ paymentUrl });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create payment' });
  }
});

// Payment callback endpoint (you can handle payment confirmation here)
app.post('/payment-callback', (req, res) => {
  console.log('Payment callback received:', req.body);
  res.status(200).send('OK');
});

app.listen(PORT, () => console.log(`PesaPal backend running on port ${PORT} ✅`));