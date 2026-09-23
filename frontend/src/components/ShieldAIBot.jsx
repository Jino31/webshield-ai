import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Sparkles, Loader2, ShieldAlert, CheckCircle2 } from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export default function ShieldSenseWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'ai', text: 'Hello! I am ShieldSense, your WebShield AI security assistant. How can I help you protect your browsing today?' }
  ]);
  const [inputValue, setInputValue] = useState('');
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

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isTyping) return;

    const userMessage = inputValue.trim();
    setInputValue('');
    setMessages(prev => [...prev, { sender: 'user', text: userMessage }]);
    setIsTyping(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/assistant`, {
        message: userMessage
      });

      const reply = response.data?.reply || "I am analyzing your security query.";
      setMessages(prev => [...prev, { sender: 'ai', text: reply }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        sender: 'ai', 
        text: "I couldn't connect to the AI engine right now. Please ensure your backend server is running." 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Open ShieldSense AI"
          className="w-14 h-14 rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] text-white flex items-center justify-center shadow-2xl shadow-purple-950/60 hover:scale-105 transition-all cursor-pointer group"
        >
          <Bot className="w-6 h-6 group-hover:rotate-12 transition-transform" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-[#0A0A0F]" />
        </button>
      )}

      {/* Chat Box Drawer */}
      {isOpen && (
        <div className="w-[360px] sm:w-[400px] h-[500px] bg-[#111118]/95 backdrop-blur-2xl border border-[#27272F] rounded-3xl shadow-2xl shadow-purple-950/50 flex flex-col overflow-hidden animate-fadeIn">
          {/* Chat Header */}
          <div className="px-5 py-4 bg-[#1A1528] border-b border-[#27272F] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#8B5CF6]/20 border border-[#8B5CF6]/40 flex items-center justify-center text-[#8B5CF6]">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                  ShieldSense AI <Sparkles className="w-3 h-3 text-[#EC4899]" />
                </h3>
                <p className="text-[10px] text-emerald-400 font-medium">● Real-Time Security Assistant</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-full bg-neutral-800/60 hover:bg-neutral-800 text-neutral-400 hover:text-white flex items-center justify-center transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3.5 rounded-2xl leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] text-white rounded-br-xs shadow-md'
                      : 'bg-[#1A1528] border border-[#27272F] text-[#FAFAFA] rounded-bl-xs'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-[#1A1528] border border-[#27272F] p-3 rounded-2xl rounded-bl-xs text-neutral-400 flex items-center gap-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[#8B5CF6]" /> ShieldSense is thinking...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar */}
          <form onSubmit={handleSendMessage} className="p-3 bg-[#0A0A0F] border-t border-[#27272F] flex items-center gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask about website safety or WebShield..."
              className="flex-1 bg-[#111118] border border-[#27272F] rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#8B5CF6] transition"
            />
            <button
              type="submit"
              disabled={isTyping || !inputValue.trim()}
              className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] hover:opacity-90 text-white flex items-center justify-center transition disabled:opacity-50 cursor-pointer shadow-lg shadow-purple-950/40"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}