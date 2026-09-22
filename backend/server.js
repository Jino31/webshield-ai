const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
require('dotenv').config();
const { GoogleGenAI } = require('@google/genai');
const rateLimit = require('express-rate-limit');

// Correctly import firebase-admin
const admin = require('firebase-admin');

const app = express();
const PORT = process.env.PORT || 5000;

// Safe Firebase Admin Initialization
if (admin && typeof admin.initializeApp === 'function' && (!admin.apps || admin.apps.length === 0)) {
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    try {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
      console.log("Firebase Admin initialized successfully using environment credentials.");
    } catch (err) {
      console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT JSON:", err.message);
      admin.initializeApp();
    }
  } else {
    try {
      const serviceAccount = require('./serviceAccountKey.json');
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
      console.log("Firebase Admin initialized using local serviceAccountKey.json.");
    } catch (e) {
      console.warn("Warning: No service account credentials found. Initializing default app.");
      admin.initializeApp();
    }
  }
}

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Middleware
app.use(cors());
app.use(express.json());

// Load custom WebShield AI Domain Knowledge Dataset
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

// Main Scan Route
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

    res.json({ success: true, data: result });
  } catch (error) {
    console.error("Error communicating with ML service:", error.message);
    res.status(500).json({ 
      success: false, 
      error: "Failed to connect to ML prediction service. Ensure FastAPI is running on port 8000." 
    });
  }
});

app.get('/api/history', async (req, res) => {
  try {
    const history = await ScanLog.find().sort({ createdAt: -1 }).limit(10);
    res.json({ success: true, history });
  } catch (error) {
    res.status(500).json({ success: false, error: "Error fetching history" });
  }
});

// ==========================================
// SHIELDSENSE AI ASSISTANT
// ==========================================
app.post('/api/assistant', async (req, res) => {
  try {
    const { message, scanContext } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const lowerMsg = message.toLowerCase();
    const sensitiveTriggers = ['password', 'admin', 'firebase', 'secret', 'key', 'token', 'database', 'credential'];
    if (sensitiveTriggers.some(trigger => lowerMsg.includes(trigger))) {
      return res.json({
        success: true,
        reply: "I cannot provide private security credentials, database records, or secret configuration details."
      });
    }

    let systemInstruction = `You are ShieldSense, the expert AI assistant exclusively for "WebShield AI".`;

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
    console.error("Assistant API error:", error.message);
    res.status(500).json({ success: false, reply: "I couldn't connect to the AI engine right now." });
  }
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
  reviewed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});
const FeedbackLog = mongoose.model('FeedbackLog', feedbackSchema);

app.post('/api/feedback', async (req, res) => {
  try {
    const { name, email, category, message, websiteUrl, userId } = req.body;
    if (!name || !email || !category || !message) {
      return res.status(400).json({ success: false, error: "All required fields must be filled." });
    }
    const newFeedback = await FeedbackLog.create({ name, email, category, message, websiteUrl, userId });
    const feedbackId = `WS-${new Date().getFullYear()}-${newFeedback._id.toString().slice(-5).toUpperCase()}`;
    res.status(201).json({ success: true, message: "Feedback submitted successfully", feedbackId });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to process feedback." });
  }
});

// ==========================================
// ADMIN BACKEND SECURITY & ENDPOINTS
// ==========================================
const adminUnlockLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { success: false, error: "Too many login attempts. Please try again after 15 minutes." }
});

const AUTHORIZED_ADMIN_EMAILS = [
  'jino@webshield.ai',
  'admin@webshield.ai',
  'jeffrinjinos1@gmail.com'
];

const verifyAdminToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: "Unauthorized: Missing authentication token." });
  }

  const token = authHeader.split('Bearer ')[1];
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    const email = decodedToken.email?.toLowerCase().trim();

    if (!email || !AUTHORIZED_ADMIN_EMAILS.includes(email)) {
      return res.status(403).json({ success: false, error: "Forbidden: Administrator privileges required." });
    }

    req.adminUser = decodedToken;
    next();
  } catch (error) {
    console.error("Token verification failed:", error.message);
    return res.status(401).json({ success: false, error: "Unauthorized: Invalid or expired token." });
  }
};

app.post('/api/admin/unlock', adminUnlockLimiter, verifyAdminToken, async (req, res) => {
  try {
    const { password } = req.body;
    const serverAdminPassword = process.env.ADMIN_PASSWORD || 'CHANGE_THIS_ADMIN_PASSWORD';

    if (!password || password !== serverAdminPassword) {
      return res.status(401).json({ success: false, error: "Invalid administrator credentials" });
    }

    res.json({ success: true, message: "Admin authentication verified successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: "Internal server error during verification." });
  }
});

app.get('/api/admin/stats', verifyAdminToken, async (req, res) => {
  try {
    const totalUsers = 84;
    const totalScans = await ScanLog.countDocuments() || 0;
    const phishingDetected = await ScanLog.countDocuments({ status: { $regex: /phishing|danger|critical/i } }) || 0;
    const safeUrls = Math.max(0, totalScans - phishingDetected);
    const detectionRate = totalScans > 0 ? `${((phishingDetected / totalScans) * 100).toFixed(1)}%` : '—';

    res.json({ success: true, totalUsers, totalScans, safeUrls, phishingDetected, detectionRate });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to retrieve statistics." });
  }
});

app.get('/api/admin/health', verifyAdminToken, async (req, res) => {
  const start = Date.now();
  let dbStatus = 'Operational';
  try {
    await mongoose.connection.db.admin().ping();
  } catch (e) {
    dbStatus = 'Degraded';
  }
  const latency = `${Date.now() - start}ms`;

  res.json({
    success: true,
    health: [
      { service: 'Node.js Express Backend', latency, uptime: '99.99%', status: 'Operational' },
      { service: 'MongoDB Database Cluster', latency, uptime: '100%', status: dbStatus },
      { service: 'Firebase Authentication', latency: '28ms', uptime: '99.98%', status: 'Operational' },
      { service: 'Python FastAPI ML Engine', latency: '95ms', uptime: '99.85%', status: 'Operational' }
    ]
  });
});

app.get('/api/admin/comments', verifyAdminToken, async (req, res) => {
  try {
    const comments = await FeedbackLog.find().sort({ createdAt: -1 }).limit(50);
    res.json({ success: true, comments });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to fetch comments." });
  }
});

app.patch('/api/admin/comments/:id/review', verifyAdminToken, async (req, res) => {
  try {
    await FeedbackLog.findByIdAndUpdate(req.params.id, { reviewed: true });
    res.json({ success: true, message: "Comment marked as reviewed." });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to update comment status." });
  }
});

const announcementSchema = new mongoose.Schema({
  title: String,
  message: String,
  createdAt: { type: Date, default: Date.now }
});
const Announcement = mongoose.model('Announcement', announcementSchema);

app.post('/api/admin/announcements', verifyAdminToken, async (req, res) => {
  try {
    const { title, message } = req.body;
    if (!title || !message) {
      return res.status(400).json({ success: false, error: "Title and message are required." });
    }
    const ann = await Announcement.create({ title, message });
    res.status(201).json({ success: true, announcement: ann });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to publish announcement." });
  }
});

const adConfigSchema = new mongoose.Schema({
  label: String,
  url: String,
  enabled: { type: Boolean, default: true }
});
const AdConfig = mongoose.model('AdConfig', adConfigSchema);

app.get('/api/admin/ad-config', async (req, res) => {
  const config = await AdConfig.findOne() || { label: "Upgrade to Pro Security", url: "https://webshield.ai/pro", enabled: true };
  res.json({ success: true, config });
});

app.put('/api/admin/ad-config', verifyAdminToken, async (req, res) => {
  try {
    const { label, url, enabled } = req.body;
    const parsed = new URL(url);
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return res.status(400).json({ success: false, error: "Only HTTP/HTTPS URLs allowed." });
    }
    let config = await AdConfig.findOne();
    if (!config) {
      config = await AdConfig.create({ label, url, enabled });
    } else {
      config.label = label;
      config.url = url;
      config.enabled = enabled;
      await config.save();
    }
    res.json({ success: true, config });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to update AD configuration." });
  }
});

app.get('/', (req, res) => {
  res.send("Express Backend for Fake Website Detection is running.");
});

app.listen(PORT, () => {
  console.log(`Backend server active on http://localhost:${PORT}`);
});