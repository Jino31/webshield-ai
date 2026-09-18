const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection (Optional: will log a warning if URI is not provided yet)
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/fake-website-detector";
mongoose.connect(MONGO_URI)
  .then(() => console.log("Connected to MongoDB successfully"))
  .catch((err) => console.log("MongoDB connection warning (running without DB):", err.message));

// Scan History Schema
const scanSchema = new mongoose.Schema({
  url: String,
  status: String,
  confidenceScore: Number,
  features: Object,
  createdAt: { type: Date, default: Date.now }
});
const ScanLog = mongoose.model('ScanLog', scanSchema);

// Main Scan Route: Forwards URL to Python FastAPI Microservice
app.post('/api/scan', async (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  try {
    // Forward the request to the Python FastAPI ML service running on port 8000
    const mlResponse = await axios.post('http://127.0.0.1:8000/predict', { url });
    const result = mlResponse.data;

    // Save scan log to MongoDB
    try {
      await ScanLog.create({
        url: result.url,
        status: result.status,
        confidenceScore: result.confidence_score,
        features: result.features_analyzed
      });
    } catch (dbErr) {
      console.log("Could not save to DB, skipping log.");
    }

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error("Error communicating with ML service:", error.message);
    res.status(500).json({ 
      success: false, 
      error: "Failed to connect to ML prediction service. Ensure FastAPI is running on port 8000." 
    });
  }
});

// Route to fetch recent scans
app.get('/api/history', async (req, res) => {
  try {
    const history = await ScanLog.find().sort({ createdAt: -1 }).limit(10);
    res.json({ success: true, history });
  } catch (error) {
    res.status(500).json({ success: false, error: "Error fetching history" });
  }
});

app.get('/', (req, res) => {
  res.send("Express Backend for Fake Website Detection is running.");
});

app.listen(PORT, () => {
  console.log(`Backend server active on http://localhost:${PORT}`);
});