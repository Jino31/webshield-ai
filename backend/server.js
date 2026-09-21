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
    const mlResponse = await axios.post('http://127.0.0.1:8000/predict', { url });
    const result = mlResponse.data;

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

// ==========================================
// NEW: ShieldSense Real-Time Assistant Route
// ==========================================
app.post('/api/assistant', async (req, res) => {
  try {
    const { message, scanContext } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    // Guardrail against sensitive credentials queries
    const lowerMsg = message.toLowerCase();
    const sensitiveTriggers = ['password', 'admin', 'firebase', 'secret', 'key', 'token', 'database', 'credential'];
    if (sensitiveTriggers.some(trigger => lowerMsg.includes(trigger))) {
      return res.json({
        success: true,
        reply: "I cannot provide private security credentials, database records, or secret configuration details. I can explain our system architecture at a high level."
      });
    }

    let reply = "";

    // Context-aware processing based on active URL scans from FastAPI/MongoDB
    if (scanContext && (lowerMsg.includes('explain') || lowerMsg.includes('flagged') || lowerMsg.includes('result') || lowerMsg.includes('score'))) {
      reply = `Based on our Random Forest classification analysis for "${scanContext.url}":
      
• Risk Level: ${scanContext.riskLevel}
• Model Confidence: ${scanContext.confidence}%
• Assessment: ${scanContext.description}

Remember that AI guidance is informational and does not guarantee absolute safety. Always verify URLs before submitting sensitive credentials.`;
    } else if (lowerMsg.includes('click') || lowerMsg.includes('phishing') || lowerMsg.includes('entered')) {
      reply = `If you interacted with a suspicious or phishing link:
1. Immediately close the browser tab and stop interacting with the site.
2. Change your passwords immediately from a verified, secure device.
3. Enable Multi-Factor Authentication (MFA) across your critical accounts.`;
    } else if (lowerMsg.includes('work') || lowerMsg.includes('detect') || lowerMsg.includes('scan') || lowerMsg.includes('webshield')) {
      reply = `WebShield AI uses a combination of lexical feature extraction (checking domain structure, length, and IP usage) and Random Forest classification models running via a high-performance Python microservice to predict threat probabilities in real time.`;
    } else {
      reply = `ShieldSense Real-Time Engine Active: I am monitoring your security queries. How can I help you analyze URL threat indicators or explain your recent scan results?`;
    }

    res.json({ success: true, reply });
  } catch (error) {
    console.error("Assistant route error:", error.message);
    res.status(500).json({ success: false, error: "Failed to process assistant request" });
  }
});

app.get('/', (req, res) => {
  res.send("Express Backend for Fake Website Detection is running.");
});

app.listen(PORT, () => {
  console.log(`Backend server active on http://localhost:${PORT}`);
});