import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

// Simple test route
app.get("/", (req, res) => {
  res.send("✅ PesaPal Backend is running!");
});

// Initiate payment route
app.post("/api/initiate-payment", async (req, res) => {
  try {
    // Step 1: Get OAuth token
    const tokenResponse = await axios.post(
      "https://pay.pesapal.com/v3/api/Auth/RequestToken",
      {
        consumer_key: process.env.PESAPAL_CONSUMER_KEY,
        consumer_secret: process.env.PESAPAL_CONSUMER_SECRET,
      }
    );

    const token = tokenResponse.data.token;

    // Step 2: Create payment order
    const orderData = {
      id: Date.now().toString(),
      amount: req.body.amount,
      description: "Payment for product",
      callback_url: "https://yourfrontend.com/thankyou",
      notification_id: "your-notification-id",
      billing_address: {
        email_address: req.body.email,
        phone_number: req.body.phone,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
      },
    };

    const orderResponse = await axios.post(
      "https://pay.pesapal.com/v3/api/Transactions/SubmitOrderRequest",
      orderData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    res.json(orderResponse.data);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: "Payment initiation failed" });
  }
});

const port = process.env.PORT || 10000;
app.listen(port, () => console.log(`✅ Server running on port ${port}`));