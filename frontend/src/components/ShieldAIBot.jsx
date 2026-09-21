import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Sparkles, ShieldAlert, Cpu, CheckCircle2 } from 'lucide-react';

export default function ShieldAIBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { 
      sender: 'bot', 
      text: 'Hello! I am ShieldAI, your cybersecurity assistant. Ask me anything about how WebShield AI detects phishing or analyzes URLs!' 
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Knowledge base responses related to WebShield AI & fake website detection
  const getBotResponse = (query) => {
    const q = query.toLowerCase();

    if (q.includes('how') && (q.includes('work') || q.includes('detect') || q.includes('scan'))) {
      return 'WebShield AI uses a multi-layered approach: 1) Instant lexical feature extraction checking URL length, IP addresses, and special characters; 2) Machine learning classification via Random Forest models to evaluate threat probabilities; and 3) Real-time database audit logging.';
    }
    if (q.includes('safe') || q.includes('accuracy') || q.includes('reliable')) {
      return 'Our models are trained on real-world security datasets and achieve over 98% confidence scoring for identifying legitimate websites versus credential-harvesting phishing links.';
    }
    if (q.includes('report') || q.includes('scam') || q.includes('phishing')) {
      return 'You can report suspicious links using our "Report a Scam" intake feature in the top navigation bar. Our automated models analyze and verify submitted URLs to protect the community.';
    }
    if (q.includes('model') || q.includes('ai') || q.includes('ml') || q.includes('random forest')) {
      return 'WebShield AI relies on Random Forest classifiers and lexical heuristics to examine URL structural anomalies without executing or rendering untrusted web content.';
    }
    if (q.includes('admin') || q.includes('password') || q.includes('dashboard')) {
      return 'The admin control center is restricted behind secure Firebase authentication and a protected admin password gate at `/admin`.';
    }

    return 'That is a great question about web security! WebShield AI is designed to protect users against spoofed domains, fake login portals, and online fraud instantly. Try asking about our ML scanning model or how to report a scam.';
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userText = inputMessage;
    const newMessages = [...messages, { sender: 'user', text: userText }];
    setMessages(newMessages);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI thinking delay
    setTimeout(() => {
      const botReply = getBotResponse(userText);
      setMessages([...newMessages, { sender: 'bot', text: botReply }]);
      setIsTyping(false);
    }, 800);
  };

  const handleQuickPrompt = (promptText) => {
    setInputMessage(promptText);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-3 bg-gradient-to-r from-[#8B5CF6] to-[#22D3EE] p-0.5 rounded-2xl shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer"
          aria-label="Open ShieldAI Assistant"
        >
          <div className="flex items-center gap-2.5 bg-[#0D1117] px-4 py-3 rounded-2xl text-white font-semibold text-xs tracking-wide">
            <div className="w-6 h-6 rounded-lg bg-[#22D3EE]/20 flex items-center justify-center text-[#22D3EE] animate-pulse">
              <Bot className="w-4 h-4" />
            </div>
            <span>Ask ShieldAI</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          </div>
        </button>
      )}

      {/* Chat Window Container */}
      {isOpen && (
        <div className="w-[360px] sm:w-[400px] h-[520px] bg-[#0D1117] border border-neutral-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-fade-in backdrop-blur-2xl">
          
          {/* Chat Header */}
          <div className="px-5 py-4 bg-[#13111C] border-b border-neutral-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#8B5CF6] to-[#22D3EE] flex items-center justify-center text-white shadow-md">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white tracking-wide flex items-center gap-1.5">
                  ShieldAI Assistant <Sparkles className="w-3 h-3 text-[#22D3EE]" />
                </h3>
                <p className="text-[10px] text-emerald-400 flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Online & Secure
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800/60 transition cursor-pointer"
              aria-label="Close chat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-[#05070A]/50">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[82%] px-4 py-3 rounded-2xl text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] text-white rounded-br-none shadow-md'
                      : 'bg-[#13111C] border border-neutral-800 text-neutral-200 rounded-bl-none shadow-inner'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-[#13111C] border border-neutral-800 px-4 py-3 rounded-2xl rounded-bl-none text-xs text-neutral-400 flex items-center gap-2">
                  <Cpu className="w-3.5 h-3.5 text-[#22D3EE] animate-spin" /> ShieldAI is analyzing...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestion Pills */}
          <div className="px-4 py-2 bg-[#13111C]/60 border-t border-neutral-800 flex gap-1.5 overflow-x-auto no-scrollbar">
            {[
              'How does scanning work?',
              'What is phishing risk?',
              'How to report a scam?'
            ].map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleQuickPrompt(prompt)}
                className="px-2.5 py-1 rounded-lg bg-[#05070A] border border-neutral-800 hover:border-[#22D3EE]/40 text-[10px] text-neutral-300 hover:text-white whitespace-nowrap transition cursor-pointer"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Chat Input Form */}
          <form onSubmit={handleSendMessage} className="p-3 bg-[#13111C] border-t border-neutral-800 flex items-center gap-2">
            <input
              type="text"
              placeholder="Ask ShieldAI about phishing detection..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="flex-1 bg-[#05070A] border border-neutral-800 focus:border-[#22D3EE] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none transition"
            />
            <button
              type="submit"
              className="p-2.5 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#22D3EE] hover:opacity-90 text-white transition cursor-pointer shadow-md"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}
    </div>
  );
}