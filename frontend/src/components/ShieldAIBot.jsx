import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, X, Send, Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react';
import { aiAssistantService } from '../services/aiAssistantService';

export default function ShieldAIBot({ scanContext = null }) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: 'Hello! I am ShieldSense, your AI security assistant. I can help explain URL scan results, security metrics, or web protection concepts.'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef(null);
  const chatRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Handle outside click to close chat
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (chatRef.current && !chatRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Page keyword router mapping
  const routeMap = {
    'home': { path: '/', name: 'Home' },
    'dashboard': { path: '/', name: 'Home' },
    'login': { path: '/login', name: 'Login' },
    'signin': { path: '/login', name: 'Login' },
    'signup': { path: '/login', name: 'Login' },
    'history': { path: '/history', name: 'Scan History' },
    'scans': { path: '/history', name: 'Scan History' },
    'settings': { path: '/settings', name: 'Settings' },
    'profile': { path: '/profile', name: 'Profile' },
    'account': { path: '/profile', name: 'Profile' },
    'scam report': { path: '/scam-report', name: 'Report a Scam' },
    'report scam': { path: '/scam-report', name: 'Report a Scam' },
    'scan trends': { path: '/scan-trends', name: 'Scan Trends' },
    'trends': { path: '/scan-trends', name: 'Scan Trends' },
    'admin': { path: '/admin', name: 'Admin Dashboard' },
    'dashboard admin': { path: '/admin', name: 'Admin Dashboard' },
    'about': { path: '/about', name: 'About' },
    'feedback': { path: '/feedback', name: 'Feedback Center' },
    'comments': { path: '/feedback', name: 'Feedback Center' }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isTyping) return;

    const userText = inputMessage.trim();
    const lowerText = userText.toLowerCase();
    const userMessage = { sender: 'user', text: userText };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      // Check if user is asking to navigate to a page
      let matchedRoute = null;
      for (const [keyword, routeInfo] of Object.entries(routeMap)) {
        if (lowerText === keyword || lowerText.includes(`go to ${keyword}`) || lowerText.includes(`open ${keyword}`) || lowerText.includes(`navigate to ${keyword}`)) {
          matchedRoute = routeInfo;
          break;
        }
      }

      if (matchedRoute) {
        setMessages(prev => [
          ...prev,
          { sender: 'bot', text: `Taking you to the ${matchedRoute.name} page right now! 🚀` }
        ]);
        setIsTyping(false);
        setTimeout(() => {
          navigate(matchedRoute.path);
          setIsOpen(false);
        }, 1000);
        return;
      }

      // Otherwise, query the AI Assistant Service
      const responseText = await aiAssistantService.sendMessage(userText, scanContext);
      setMessages(prev => [...prev, { sender: 'bot', text: responseText }]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        { sender: 'bot', text: "I couldn't connect to the security assistant right now. Please try again in a moment." }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickPrompt = (promptText) => {
    if (isTyping) return;
    setInputMessage(promptText);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50" ref={chatRef}>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-3 bg-gradient-to-r from-cyan-400 via-sky-500 to-indigo-600 p-0.5 rounded-2xl shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer shadow-cyan-950/40"
          aria-label="Open ShieldSense AI Security Assistant"
        >
          <div className="flex items-center gap-3 bg-[#080D1A] px-5 py-3.5 rounded-2xl text-white font-semibold text-sm tracking-wide">
            <div className="w-7 h-7 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-400 animate-pulse">
              <Bot className="w-4 h-4" />
            </div>
            <span>Ask ShieldSense</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
          </div>
        </button>
      )}

      {/* Chat Window Container */}
      {isOpen && (
        <div className="w-[calc(100vw-2rem)] max-w-[420px] h-[560px] bg-[#080D1A]/95 border border-[#16223A] rounded-3xl shadow-2xl shadow-cyan-950/30 flex flex-col overflow-hidden animate-fade-in backdrop-blur-2xl">

          {/* Chat Header */}
          <div className="px-5 py-4 bg-[#0C1220] border-b border-[#16223A] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white shadow-md">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white tracking-wide flex items-center gap-1.5">
                  ShieldSense <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                </h3>
                <p className="text-xs text-emerald-400 flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Online • AI Navigator & Assistant
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition cursor-pointer"
              aria-label="Close chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scan Context Status Indicator */}
          <div className="px-4 py-2.5 bg-[#050914]/90 border-b border-[#16223A]/80 flex items-center justify-between text-xs">
            <span className="text-slate-300 flex items-center gap-2">
              {scanContext ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-emerald-300 truncate max-w-[260px] font-medium">Scan loaded: {scanContext.url}</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>Type a page name to jump anywhere</span>
                </>
              )}
            </span>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-[#050914]/60">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed font-normal whitespace-pre-wrap ${msg.sender === 'user'
                    ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white rounded-br-none shadow-md font-medium'
                    : 'bg-[#0C1220] border border-[#16223A] text-white rounded-bl-none shadow-inner'
                    }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-[#0C1220] border border-[#16223A] px-4 py-3 rounded-2xl rounded-bl-none text-sm text-white flex items-center gap-2.5">
                  <span className="text-cyan-400 font-medium">ShieldSense is processing</span>
                  <span className="flex gap-1">
                    <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></span>
                  </span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Page Shortcut Pills */}
          <div className="px-4 py-2.5 bg-[#0C1220]/80 border-t border-[#16223A] flex gap-2 overflow-x-auto no-scrollbar">
            <button onClick={() => handleQuickPrompt("admin")} className="px-3 py-1.5 rounded-xl bg-[#050914] border border-[#16223A] hover:border-cyan-500/40 text-xs text-white whitespace-nowrap transition cursor-pointer font-medium">
              Admin 🛡️
            </button>
            <button onClick={() => handleQuickPrompt("profile")} className="px-3 py-1.5 rounded-xl bg-[#050914] border border-[#16223A] hover:border-cyan-500/40 text-xs text-white whitespace-nowrap transition cursor-pointer font-medium">
              Profile 👤
            </button>
            <button onClick={() => handleQuickPrompt("settings")} className="px-3 py-1.5 rounded-xl bg-[#050914] border border-[#16223A] hover:border-cyan-500/40 text-xs text-white whitespace-nowrap transition cursor-pointer font-medium">
              Settings ⚙️
            </button>
            <button onClick={() => handleQuickPrompt("history")} className="px-3 py-1.5 rounded-xl bg-[#050914] border border-[#16223A] hover:border-cyan-500/40 text-xs text-white whitespace-nowrap transition cursor-pointer font-medium">
              History 📊
            </button>
            <button onClick={() => handleQuickPrompt("feedback")} className="px-3 py-1.5 rounded-xl bg-[#050914] border border-[#16223A] hover:border-cyan-500/40 text-xs text-white whitespace-nowrap transition cursor-pointer font-medium">
              Feedback 💬
            </button>
          </div>

          {/* Chat Input Form */}
          <form onSubmit={handleSendMessage} className="p-3.5 bg-[#0C1220] border-t border-[#16223A] flex items-center gap-2">
            <input
              type="text"
              placeholder="Type page name or security question..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              disabled={isTyping}
              className="flex-1 bg-[#050914] border border-[#16223A] focus:border-cyan-400 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-400 focus:outline-none transition disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isTyping || !inputMessage.trim()}
              className="p-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:opacity-90 disabled:opacity-50 text-white transition cursor-pointer shadow-md"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          {/* Security Disclaimer */}
          <div className="px-3 py-2 bg-[#05070A] text-[10px] text-neutral-300 font-medium text-center border-t border-neutral-900">
            Type any page name (e.g. admin, profile, history) to jump instantly.
          </div>

        </div>
      )}
    </div>
  );
}