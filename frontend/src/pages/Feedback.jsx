import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, Send, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';
import { feedbackService } from '../services/feedbackService';

// Optional: Import auth from your existing Firebase configuration if configured
// import { auth } from '../firebase';
// import { onAuthStateChanged } from 'firebase/auth';

const CATEGORIES = [
  'General Feedback',
  'False Positive',
  'False Negative',
  'Detection Accuracy',
  'UI / UX',
  'ShieldSense AI',
  'Bug Report',
  'Feature Request',
  'Security Issue',
  'Other'
];

export default function Feedback() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: 'General Feedback',
    message: '',
    websiteUrl: ''
  });

  const [userId, setUserId] = useState(null);
  const [isAuthenticatedUser, setIsAuthenticatedUser] = useState(false);
  const [status, setStatus] = useState('initial'); // 'initial', 'submitting', 'success', 'error'
  const [errorMessage, setErrorMessage] = useState('');
  const [feedbackId, setFeedbackId] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  // Firebase Auth listener with proper cleanup
  useEffect(() => {
    let unsubscribe = () => {};
    try {
      // Uncomment below if Firebase auth is configured in your project:
      /*
      unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          setUserId(user.uid);
          setIsAuthenticatedUser(true);
          setFormData(prev => ({
            ...prev,
            email: user.email || prev.email,
            name: user.displayName || prev.name
          }));
        } else {
          setUserId(null);
          setIsAuthenticatedUser(false);
        }
      });
      */
    } catch (err) {
      // Firebase auth not initialized or optional
    }

    return () => unsubscribe();
  }, []);

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim() || formData.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters long.';
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email)) {
      errors.email = 'Please enter a valid email address.';
    }

    if (!formData.category) {
      errors.category = 'Please select a category.';
    }

    if (!formData.message.trim() || formData.message.trim().length < 10) {
      errors.message = 'Message must be at least 10 characters long.';
    } else if (formData.message.length > 1000) {
      errors.message = 'Message cannot exceed 1000 characters.';
    }

    if (formData.websiteUrl.trim()) {
      try {
        const parsedUrl = new URL(formData.websiteUrl.trim());
        if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
          errors.websiteUrl = 'Only HTTP and HTTPS URLs are allowed.';
        }
      } catch (_) {
        errors.websiteUrl = 'Please enter a valid URL (e.g., https://example.com).';
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Clear submission error state when user modifies form fields
    if (status === 'error') {
      setStatus('initial');
      setErrorMessage('');
    }

    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status === 'submitting') return;
    if (!validateForm()) return;

    setStatus('submitting');
    setErrorMessage('');

    const payload = {
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      category: formData.category,
      message: formData.message.trim(),
      websiteUrl: formData.websiteUrl.trim() || null,
      userId: userId || null,
      createdAt: new Date().toISOString()
    };

    try {
      const response = await feedbackService.submitFeedback(payload);
      
      setStatus('success');
      if (response && response.feedbackId) {
        setFeedbackId(response.feedbackId);
      }
    } catch (err) {
      setStatus('error');
      setErrorMessage(err.message);
    }
  };

  const handleResetForm = () => {
    setStatus('initial');
    setValidationErrors({});
    setErrorMessage('');
    setFeedbackId(null);
    setFormData({
      name: isAuthenticatedUser ? formData.name : '',
      email: isAuthenticatedUser ? formData.email : '',
      category: 'General Feedback',
      message: '',
      websiteUrl: ''
    });
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-[#FAFAFA] flex flex-col justify-between p-4 sm:p-8 relative overflow-x-hidden">
      {/* Background Glow Orbs */}
      <div className="absolute top-1/4 left-10 w-[400px] h-[400px] bg-[#8B5CF6]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-[#EC4899]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-xl mx-auto w-full pt-6 relative z-10">
        <button 
          onClick={() => navigate('/')} 
          className="text-xs font-semibold text-[#8B5CF6] hover:text-[#C4B5FD] mb-6 flex items-center gap-2 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </button>

        <div className="bg-[#111118]/90 backdrop-blur-xl border border-[#27272F] rounded-3xl p-6 sm:p-8 shadow-2xl shadow-purple-950/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-[#1A1528] border border-[#2B2340] flex items-center justify-center text-[#8B5CF6] shadow-inner">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#1A1528] border border-[#2B2340] text-[#8B5CF6] text-[10px] font-bold uppercase tracking-wider mb-1">
                Feedback Center
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">Help Us Strengthen Web Safety</h1>
            </div>
          </div>
          <p className="text-[#A1A1AA] text-xs sm:text-sm mb-6 leading-relaxed">
            Your feedback helps us improve phishing detection accuracy, usability, and the ShieldSense AI experience.
          </p>

          {/* Error Banner */}
          {status === 'error' && (
            <div role="alert" className="mb-6 p-4 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-3 animate-fadeIn">
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Submission Failed</p>
                <p className="text-rose-400/90 mt-0.5">{errorMessage}</p>
              </div>
            </div>
          )}

          {/* Success Screen */}
          {status === 'success' ? (
            <div role="status" className="bg-[#0A0A0F] border border-[#27272F] p-8 rounded-2xl text-center space-y-4 animate-fadeIn">
              <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center justify-center text-[#10B981] mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white mb-1">Feedback Received</h2>
                <p className="text-xs text-[#A1A1AA] leading-relaxed">
                  Thank you for helping us protect the web. We have logged your response successfully.
                </p>
                {feedbackId && (
                  <div className="mt-3 inline-block bg-[#111118] border border-[#27272F] px-3 py-1 rounded-lg text-xs font-mono text-[#8B5CF6]">
                    Feedback ID: {feedbackId}
                  </div>
                )}
              </div>
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button 
                  onClick={handleResetForm}
                  className="flex-1 py-3 px-4 bg-[#1A1528] hover:bg-[#231E33] border border-[#2B2340] text-white rounded-xl text-xs font-semibold transition-all cursor-pointer"
                >
                  Send Another Response
                </button>
                <button 
                  onClick={() => navigate('/')}
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] hover:opacity-90 text-white rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-lg shadow-purple-950/40"
                >
                  Back to Home
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-xs font-semibold text-[#FAFAFA] mb-1">
                  Your Name <span className="text-[#EC4899]">*</span>
                </label>
                <input 
                  type="text" 
                  id="name"
                  name="name"
                  autoComplete="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={status === 'submitting'}
                  aria-invalid={!!validationErrors.name}
                  aria-describedby={validationErrors.name ? 'name-error' : undefined}
                  placeholder="Enter your full name"
                  className={`w-full bg-[#0A0A0F] border ${validationErrors.name ? 'border-rose-500' : 'border-[#27272F]'} rounded-xl px-4 py-3 text-xs sm:text-sm focus:outline-none focus:border-[#8B5CF6] text-white placeholder-neutral-600 transition-all disabled:opacity-50`}
                />
                {validationErrors.name && (
                  <p id="name-error" role="alert" className="text-rose-400 text-[11px] mt-1">{validationErrors.name}</p>
                )}
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-xs font-semibold text-[#FAFAFA] mb-1">
                  Email Address <span className="text-[#EC4899]">*</span>
                </label>
                <input 
                  type="email" 
                  id="email"
                  name="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={status === 'submitting'}
                  aria-invalid={!!validationErrors.email}
                  aria-describedby={validationErrors.email ? 'email-error' : undefined}
                  placeholder="name@example.com"
                  className={`w-full bg-[#0A0A0F] border ${validationErrors.email ? 'border-rose-500' : 'border-[#27272F]'} rounded-xl px-4 py-3 text-xs sm:text-sm focus:outline-none focus:border-[#8B5CF6] text-white placeholder-neutral-600 transition-all disabled:opacity-50`}
                />
                {validationErrors.email && (
                  <p id="email-error" role="alert" className="text-rose-400 text-[11px] mt-1">{validationErrors.email}</p>
                )}
              </div>

              {/* Category & Optional URL Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="category" className="block text-xs font-semibold text-[#FAFAFA] mb-1">
                    Feedback Category <span className="text-[#EC4899]">*</span>
                  </label>
                  <select 
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    disabled={status === 'submitting'}
                    aria-invalid={!!validationErrors.category}
                    className="w-full bg-[#0A0A0F] border border-[#27272F] rounded-xl px-3 py-3 text-xs sm:text-sm focus:outline-none focus:border-[#8B5CF6] text-white transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat} className="bg-[#111118] text-white">{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="websiteUrl" className="block text-xs font-semibold text-[#FAFAFA] mb-1">
                    Website URL <span className="text-[#A1A1AA] font-normal">(Optional)</span>
                  </label>
                  <input 
                    type="url" 
                    id="websiteUrl"
                    name="websiteUrl"
                    autoComplete="url"
                    value={formData.websiteUrl}
                    onChange={handleChange}
                    disabled={status === 'submitting'}
                    aria-invalid={!!validationErrors.websiteUrl}
                    aria-describedby={validationErrors.websiteUrl ? 'url-error' : undefined}
                    placeholder="https://suspicious-site.com"
                    className={`w-full bg-[#0A0A0F] border ${validationErrors.websiteUrl ? 'border-rose-500' : 'border-[#27272F]'} rounded-xl px-4 py-3 text-xs sm:text-sm focus:outline-none focus:border-[#8B5CF6] text-white placeholder-neutral-600 transition-all disabled:opacity-50`}
                  />
                  {validationErrors.websiteUrl && (
                    <p id="url-error" role="alert" className="text-rose-400 text-[11px] mt-1">{validationErrors.websiteUrl}</p>
                  )}
                </div>
              </div>

              {/* Message Field */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label htmlFor="message" className="block text-xs font-semibold text-[#FAFAFA]">
                    Your Message <span className="text-[#EC4899]">*</span>
                  </label>
                  <span className={`text-[11px] font-mono ${formData.message.length >= 950 ? 'text-amber-400 font-bold' : 'text-[#A1A1AA]'}`}>
                    {formData.message.length} / 1000
                  </span>
                </div>
                <textarea 
                  id="message"
                  name="message"
                  rows="4"
                  maxLength={1000}
                  value={formData.message}
                  onChange={handleChange}
                  disabled={status === 'submitting'}
                  aria-invalid={!!validationErrors.message}
                  aria-describedby={validationErrors.message ? 'message-error' : undefined}
                  placeholder="Describe your feedback, report a false positive, or suggest a feature (min. 10 characters)..."
                  className={`w-full bg-[#0A0A0F] border ${validationErrors.message ? 'border-rose-500' : 'border-[#27272F]'} rounded-xl p-4 text-xs sm:text-sm focus:outline-none focus:border-[#8B5CF6] text-white placeholder-neutral-600 resize-none transition-all disabled:opacity-50`}
                />
                {validationErrors.message && (
                  <p id="message-error" role="alert" className="text-rose-400 text-[11px] mt-1">{validationErrors.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <button 
                type="submit"
                disabled={status === 'submitting'}
                className={`w-full py-3.5 px-6 bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] hover:opacity-90 text-white font-semibold rounded-xl text-xs sm:text-sm transition-all shadow-lg shadow-purple-950/40 flex items-center justify-center gap-2 ${
                  status === 'submitting' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer active:scale-[0.99]'
                }`}
              >
                {status === 'submitting' ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Submitting Feedback...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" /> Submit Feedback
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>

      <footer className="text-center text-[11px] text-[#A1A1AA] py-4 relative z-10">
        WebShield AI Platform • Security & Phishing Defense
      </footer>
    </div>
  );
}