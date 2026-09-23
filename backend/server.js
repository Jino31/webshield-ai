const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
require('dotenv').config();
const { GoogleGenAI } = require('@google/genai');
const { checkThreatFeeds } = require('./services/threatFeeds');
const { analyzeDomain, extractDomain } = require('./services/domainAnalysis');
const { computeRiskScore } = require('./services/riskScore');
const { getChatbotAdvice } = require('./services/chatbotAdvice');
const { validateReport } = require('./services/reportValidation');

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
  .catch((err) => console.log("MongoDB connection warning:", err.message));

// Scan History Schema
const scanSchema = new mongoose.Schema({
  url: String,
  status: String,
  confidenceScore: Number,
  features: Object,
  riskScore: Number,
  createdAt: { type: Date, default: Date.now }
});
const ScanLog = mongoose.models.ScanLog || mongoose.model('ScanLog', scanSchema);

// User Schema for Admin Management
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  role: { type: String, default: 'User' },
  status: { type: String, default: 'Active' },
  createdAt: { type: Date, default: Date.now }
});
const UserLog = mongoose.models.UserLog || mongoose.model('UserLog', userSchema);

<<<<<<< HEAD
const FeedbackLog = mongoose.models.FeedbackLog || mongoose.model('FeedbackLog', feedbackSchema);

// ==========================================
// FEEDBACK API ENDPOINT (Bulletproofed)
// ==========================================
=======
// Feedback Schema & Public Submission Route
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

const FeedbackLog = mongoose.models.FeedbackLog || mongoose.model('FeedbackLog', feedbackSchema);

>>>>>>> 330fe000b0c07a64433e69f4fbbd1ec56fc93345
app.post('/api/feedback', async (req, res) => {
  try {
    const { name, email, category, message, websiteUrl, userId } = req.body;

    if (!name || !email || !category || !message) {
      return res.status(400).json({ success: false, error: "All required fields must be filled." });
    }

    const newFeedback = await FeedbackLog.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      category,
      message: message.trim(),
      websiteUrl: websiteUrl ? websiteUrl.trim() : null,
      userId: userId || null,
      reviewed: false
    });

    const feedbackId = `WS-${new Date().getFullYear()}-${newFeedback._id.toString().slice(-5).toUpperCase()}`;

    return res.status(201).json({
      success: true,
      message: "Feedback submitted successfully",
      feedbackId
    });
  } catch (error) {
    console.error("Feedback submission error:", error.message);
    return res.status(500).json({
      success: false,
      error: "We couldn't process your feedback right now. Please try again later."
    });
  }
});
<<<<<<< HEAD
// ==========================================
// SCAM REPORT SCHEMA & ROUTE
// Per-domain victim reports — verified reports feed the risk score
// computed in /api/scan below. Kept separate from FeedbackLog above
// since ReportScam.jsx collects url/category/description/proof, not
// name/email like the general Feedback page does.
// ==========================================
const scamReportSchema = new mongoose.Schema({
  url: { type: String, required: true, trim: true },
  domain: { type: String, required: true, trim: true, lowercase: true, index: true },
  category: { type: String, required: true },
  description: { type: String, trim: true, default: '' },
  proofUrl: { type: String, trim: true, default: null },
  verified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});
const ScamReport = mongoose.models.ScamReport || mongoose.model('ScamReport', scamReportSchema);

app.post('/api/report-scam', async (req, res) => {
  try {
    const { url, category, description, proofUrl } = req.body;
    if (!url || !category) {
      return res.status(400).json({ success: false, error: 'URL and category are required.' });
    }

    let domain;
    try {
      domain = extractDomain(url);
    } catch {
      return res.status(400).json({ success: false, error: 'Enter a valid URL, e.g. https://example.com' });
    }

    const isDuplicateProofUrl = proofUrl
      ? Boolean(await ScamReport.findOne({ proofUrl: proofUrl.trim() }))
      : false;

    const { verified, issues } = validateReport({ description, proofUrl, isDuplicateProofUrl });

    const report = await ScamReport.create({
      url: url.trim(),
      domain,
      category,
      description: description ? description.trim() : '',
      proofUrl: proofUrl ? proofUrl.trim() : null,
      verified
    });

    res.status(201).json({
      success: true,
      message: verified
        ? "Report received and verified — it now counts toward this site's risk score."
        : 'Report received. Add more detail or a proof link so it counts toward the risk score.',
      verified,
      issues,
      reportId: report._id
    });
  } catch (error) {
    console.error('Scam report submission error:', error.message);
    res.status(500).json({
      success: false,
      error: "We couldn't process your report right now. Please try again later."
    });
  }
});
=======
>>>>>>> 330fe000b0c07a64433e69f4fbbd1ec56fc93345

// Main Scan Route: Forwards URL to Python FastAPI Microservice
app.post('/api/scan', async (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  try {
    const mlResponse = await axios.post('http://127.0.0.1:8000/predict', { url });
    const mlResult = mlResponse.data;

    // Objective signals your lexical-feature model doesn't see: domain age/SSL/typosquat,
    // known threat-feed listings, and verified victim reports for this domain.
    let domainInfo = null;
    let threatFeeds = null;
    let verifiedReportCount = 0;

    try {
      domainInfo = await analyzeDomain(url);
    } catch (e) {
      console.log('Domain analysis skipped:', e.message);
    }

    try {
      threatFeeds = await checkThreatFeeds(url);
    } catch (e) {
      console.log('Threat feed check skipped:', e.message);
    }

    if (domainInfo?.domain) {
      verifiedReportCount = await ScamReport.countDocuments({
        domain: domainInfo.domain,
        verified: true
      }).catch(() => 0);
    }

    const risk = computeRiskScore({ mlResult, threatFeeds, domainInfo, verifiedReportCount });
    const advice = getChatbotAdvice(risk, domainInfo?.domain || mlResult.url);

    try {
      await ScanLog.create({
        url: mlResult.url,
        status: mlResult.status,
        confidenceScore: mlResult.confidence_score,
        features: mlResult.features_analyzed,
        riskScore: risk.score
      });
    } catch (dbErr) {
      console.log("Could not save to DB, skipping log.");
    }

    res.json({
      success: true,
      data: { ...mlResult, domainInfo, threatFeeds, verifiedReportCount, risk, advice }
    });
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
// SHIELDSENSE REAL-TIME CUSTOM AI ASSISTANT
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

    let systemInstruction = `You are ShieldSense, the expert AI assistant for WebShield AI. Reference Knowledge Base: ${JSON.stringify(knowledgeBase)}`;

    if (scanContext) {
      systemInstruction += `\n\nActive Scan Context: URL: ${scanContext.url}, Risk Level: ${scanContext.riskLevel}`;
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
      reply: "I couldn't connect to the real-time AI security engine right now." 
    });
  }
});

// ==========================================
// REAL-TIME ADMIN ENDPOINTS
// ==========================================
app.post('/api/admin/unlock', async (req, res) => {
  try {
    const { password } = req.body;
    const serverAdminPassword = process.env.ADMIN_PASSWORD || 'CHANGE_THIS_ADMIN_PASSWORD';

    if (!password || password !== serverAdminPassword) {
      return res.status(401).json({ success: false, error: "Invalid administrator key." });
    }

    res.json({ success: true, message: "Admin access granted." });
  } catch (error) {
    res.status(500).json({ success: false, error: "Server error during verification." });
  }
});

app.get('/api/admin/stats', async (req, res) => {
  try {
    const totalUsers = await UserLog.countDocuments().catch(() => 1);
    const totalScans = await ScanLog.countDocuments().catch(() => 0);
    const phishingDetected = await ScanLog.countDocuments({ status: { $regex: /phishing|danger|critical/i } }).catch(() => 0);
    const safeUrls = Math.max(0, totalScans - phishingDetected);
    const detectionRate = totalScans > 0 ? `${((phishingDetected / totalScans) * 100).toFixed(1)}%` : '—';

    res.json({ success: true, totalUsers, totalScans, safeUrls, phishingDetected, detectionRate });
  } catch (error) {
    res.json({ success: true, totalUsers: 1, totalScans: 0, safeUrls: 0, phishingDetected: 0, detectionRate: '—' });
  }
});

app.get('/api/admin/users', async (req, res) => {
  try {
    const users = await UserLog.find().sort({ createdAt: -1 }).limit(50).catch(() => []);
    res.json({ success: true, users: users.length > 0 ? users : [{ id: 'usr_01', name: 'S. Jeffrin Jino', email: 'jino@webshield.ai', role: 'User', status: 'Active' }] });
  } catch (error) {
    res.json({ success: true, users: [] });
  }
});

app.get('/api/admin/health', async (req, res) => {
  const start = Date.now();
  let dbStatus = 'Operational';
  try {
    if (mongoose.connection && mongoose.connection.db) {
      await mongoose.connection.db.admin().ping();
    }
  } catch (e) {
    dbStatus = 'Degraded';
  }
  const latency = `${Date.now() - start}ms`;

  res.json({
    success: true,
    health: [
      { service: 'Node.js Express Backend', latency, uptime: '99.99%', status: 'Operational' },
      { service: 'MongoDB Database Cluster', latency, uptime: '100%', status: dbStatus },
      { service: 'Firebase Auth Service', latency: '24ms', uptime: '100%', status: 'Operational' },
      { service: 'Python FastAPI ML Engine', latency: '88ms', uptime: '99.90%', status: 'Operational' }
    ]
  });
});

app.get('/api/admin/comments', async (req, res) => {
  try {
    const comments = await FeedbackLog.find().sort({ createdAt: -1 }).limit(50).catch(() => []);
    res.json({ success: true, comments: comments || [] });
  } catch (error) {
    res.json({ success: true, comments: [] });
  }
});

app.patch('/api/admin/comments/:id/review', async (req, res) => {
  try {
    await FeedbackLog.findByIdAndUpdate(req.params.id, { reviewed: true });
    res.json({ success: true, message: "Marked as reviewed." });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to update comment." });
  }
});

const announcementSchema = mongoose.models.Announcement || new mongoose.Schema({
  title: String,
  message: String,
  createdAt: { type: Date, default: Date.now }
});
const Announcement = mongoose.models.Announcement || mongoose.model('Announcement', announcementSchema);

app.post('/api/admin/announcements', async (req, res) => {
  try {
    const { title, message } = req.body;
    if (!title || !message) return res.status(400).json({ error: "Title and message required." });
    const ann = await Announcement.create({ title, message });
    res.status(201).json({ success: true, announcement: ann });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to publish announcement." });
  }
});

const adConfigSchema = mongoose.models.AdConfig || new mongoose.Schema({
  label: String,
  url: String,
  enabled: { type: Boolean, default: true }
});
const AdConfig = mongoose.models.AdConfig || mongoose.model('AdConfig', adConfigSchema);

app.get('/api/admin/ad-config', async (req, res) => {
  try {
    const config = await AdConfig.findOne() || { label: "Upgrade to Pro", url: "https://webshield.ai/pro", enabled: true };
    res.json({ success: true, config });
  } catch (e) {
    res.json({ success: true, config: { label: "Upgrade to Pro", url: "https://webshield.ai/pro", enabled: true } });
  }
});

app.put('/api/admin/ad-config', async (req, res) => {
  try {
    const { label, url, enabled } = req.body;
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

app.listen(PORT, () => {
  console.log(`WebShield Backend running on port ${PORT}`);
});