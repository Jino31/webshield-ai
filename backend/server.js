const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
require('dotenv').config();
const { GoogleGenAI } = require('@google/genai');

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Middleware
app.use(cors());
app.use(express.json());

// Load custom WebShield AI Domain Knowledge Dataset from root dataset folder
const knowledgeBasePath = path.join(__dirname, '..', 'dataset', 'webshield_knowledge.json');
let knowledgeBase = [];
try {
  if (fs.existsSync(knowledgeBasePath)) {
    const data = fs.readFileSync(knowledgeBasePath, 'utf8');
    knowledgeBase = JSON.parse(data);
    console.log("Loaded WebShield AI knowledge dataset successfully.");
  } else {
    console.log("Knowledge dataset not found at:", knowledgeBasePath);
  }
} catch (err) {
  console.log("Could not load knowledge dataset:", err.message);
}

// MongoDB Connection
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
// SHIELDSENSE REAL-TIME CUSTOM AI ASSISTANT
// ==========================================
app.post('/api/assistant', async (req, res) => {
  try {
    const { message, scanContext } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    // Security Guardrail against sensitive credentials queries
    const lowerMsg = message.toLowerCase();
    const sensitiveTriggers = ['password', 'admin', 'firebase', 'secret', 'key', 'token', 'database', 'credential'];
    if (sensitiveTriggers.some(trigger => lowerMsg.includes(trigger))) {
      return res.json({
        success: true,
        reply: "I cannot provide private security credentials, database records, or secret configuration details. I can explain our system architecture or platform features at a high level."
      });
    }

    let systemInstruction = `You are ShieldSense, the dedicated, expert AI assistant exclusively for "WebShield AI", a platform specialized in detecting fake websites and phishing using Random Forest machine learning models and lexical analysis.
    
    CRITICAL BEHAVIORAL RULES:
    1. You must ONLY answer questions related to WebShield AI, its features, its machine learning architecture, threat detection, cybersecurity best practices against phishing, or active user scan results.
    2. If a user asks a question completely unrelated to WebShield AI or cybersecurity, you must decline politely: "I am ShieldSense, specialized exclusively in WebShield AI security and phishing detection. I can only answer questions related to our platform, URL scanning, and threat analysis."
    3. Never disclose internal admin passwords, API keys, or raw database secrets.
    4. Keep answers clear, professional, and well-structured.

    Reference Knowledge Base Dataset:
    ${JSON.stringify(knowledgeBase)}
    `;

    if (scanContext) {
      systemInstruction += `\n\nActive Scan Context provided by user's recent scan:
      - URL: ${scanContext.url}
      - Risk Level: ${scanContext.riskLevel}
      - Confidence Score: ${scanContext.confidence}%
      - Assessment Description: ${scanContext.description}`;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: message,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.3,
      }
    });

    const reply = response.text || "I am analyzing your query regarding WebShield AI.";
    res.json({ success: true, reply });

  } catch (error) {
    console.error("Custom Assistant API error:", error.message);
    res.status(500).json({ 
      success: false, 
      reply: "I couldn't connect to the real-time AI security engine right now. Please ensure your backend .env file has a valid GEMINI_API_KEY." 
    });
  }
});

app.get('/', (req, res) => {
  res.send("Express Backend for Fake Website Detection is running.");
});

app.listen(PORT, () => {
  console.log(`Backend server active on http://localhost:${PORT}`);
});
// ==========================================
// FEEDBACK API ENDPOINT
// ==========================================
const feedbackSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  category: { type: String, required: true },
  message: { type: String, required: true, maxlength: 1000 },
  websiteUrl: { type: String, trim: true, default: null },
  userId: { type: String, default: null },
  createdAt: { type: Date, default: Date.now }
});
const FeedbackLog = mongoose.model('FeedbackLog', feedbackSchema);

app.post('/api/feedback', async (req, res) => {
  try {
    const { name, email, category, message, websiteUrl, userId } = req.body;

    if (!name || !email || !category || !message) {
      return res.status(400).json({ success: false, error: "All required fields must be filled." });
    }

    if (message.length > 1000) {
      return res.status(400).json({ success: false, error: "Message exceeds 1000 character limit." });
    }

    const newFeedback = await FeedbackLog.create({
      name,
      email,
      category,
      message,
      websiteUrl: websiteUrl || null,
      userId: userId || null
    });

    const feedbackId = `WS-${new Date().getFullYear()}-${newFeedback._id.toString().slice(-5).toUpperCase()}`;

    res.status(201).json({
      success: true,
      message: "Feedback submitted successfully",
      feedbackId
    });
  } catch (error) {
    console.error("Feedback submission error:", error.message);
    res.status(500).json({
      success: false,
      error: "We couldn't process your feedback right now. Please try again later."
    });
  }
});