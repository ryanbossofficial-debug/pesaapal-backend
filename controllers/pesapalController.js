import express from "express";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

router.get("/token", async (req, res) => {
  try {
    const response = await axios.post(
      "https://pay.pesapal.com/v3/api/Auth/RequestToken",
      {
        consumer_key: process.env.PESAPAL_CONSUMER_KEY,
        consumer_secret: process.env.PESAPAL_CONSUMER_SECRET,
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error("Token Error:", error.response?.data || error.message);
    res.status(500).json({ message: "Error getting token", error: error.message });
  }
});

export default router;
