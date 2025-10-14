import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Health check
app.get('/', (req, res) => res.send('PesaPal backend running ✅'));

// Create payment endpoint
app.get('/create-payment', (req, res) => {
  const { platform, service, amount, units } = req.query;

  if (!platform || !service || !amount || !units) {
    return res.status(400).json({ error: 'Missing query parameters' });
  }

  // For now, just redirect to thank-you page
  const redirectUrl = 'https://echofemme1thankyou.edgeone.app/';
  res.redirect(redirectUrl);
});

app.listen(PORT, () => console.log(`PesaPal backend running on port ${PORT} ✅`));