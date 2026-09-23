import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react';
import { aiAssistantService } from '../services/aiAssistantService';

export default function ShieldAIBot({ scanContext = null }) {
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

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isTyping) return;

    const userText = inputMessage;
    const userMessage = { sender: 'user', text: userText };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
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
          className="group relative flex items-center gap-3 bg-gradient-to-r from-[#8B5CF6] to-[#22D3EE] p-0.5 rounded-2xl shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer"
          aria-label="Open ShieldSense AI Security Assistant"
        >
          <div className="flex items-center gap-3 bg-[#0D1117] px-5 py-3.5 rounded-2xl text-white font-semibold text-sm tracking-wide">
            <div className="w-7 h-7 rounded-lg bg-[#22D3EE]/20 flex items-center justify-center text-[#22D3EE] animate-pulse">
              <Bot className="w-4 h-4" />
            </div>
            <span>Ask ShieldSense</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
          </div>
        </button>
      )}

      {/* Chat Window Container */}
      {isOpen && (
        <div className="w-[calc(100vw-2rem)] max-w-[420px] h-[560px] bg-[#0D1117] border border-neutral-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-fade-in backdrop-blur-2xl">

          {/* Chat Header */}
          <div className="px-5 py-4 bg-[#13111C] border-b border-neutral-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#8B5CF6] to-[#22D3EE] flex items-center justify-center text-white shadow-md">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white tracking-wide flex items-center gap-1.5">
                  ShieldSense <Sparkles className="w-3.5 h-3.5 text-[#22D3EE]" />
                </h3>
                <p className="text-xs text-emerald-400 flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Online • AI Security Assistant
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800/60 transition cursor-pointer"
              aria-label="Close chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scan Context Status Indicator */}
          <div className="px-4 py-2.5 bg-[#05070A]/90 border-b border-neutral-800/80 flex items-center justify-between text-xs">
            <span className="text-neutral-300 flex items-center gap-2">
              {scanContext ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-emerald-300 truncate max-w-[260px] font-medium">Scan loaded: {scanContext.url}</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-neutral-400 shrink-0" />
                  <span>No scan selected</span>
                </>
              )}
            </span>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-[#05070A]/60">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed font-normal whitespace-pre-wrap ${msg.sender === 'user'
                    ? 'bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] text-white rounded-br-none shadow-md font-medium'
                    : 'bg-[#13111C] border border-neutral-800 text-white rounded-bl-none shadow-inner'
                    }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-[#13111C] border border-neutral-800 px-4 py-3 rounded-2xl rounded-bl-none text-sm text-white flex items-center gap-2.5">
                  <span className="text-[#22D3EE] font-medium">ShieldSense is analyzing</span>
                  <span className="flex gap-1">
                    <span className="w-2 h-2 bg-[#22D3EE] rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-2 h-2 bg-[#22D3EE] rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-2 h-2 bg-[#22D3EE] rounded-full animate-bounce"></span>
                  </span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestion Pills */}
          <div className="px-4 py-2.5 bg-[#13111C]/80 border-t border-neutral-800 flex gap-2 overflow-x-auto no-scrollbar">
            {scanContext ? (
              <>
                <button
                  onClick={() => handleQuickPrompt("Explain my scan result")}
                  className="px-3 py-1.5 rounded-xl bg-[#05070A] border border-neutral-800 hover:border-[#22D3EE]/40 text-xs text-white whitespace-nowrap transition cursor-pointer font-medium"
                >
                  Explain my scan
                </button>
                <button
                  onClick={() => handleQuickPrompt("Why was this URL flagged?")}
                  className="px-3 py-1.5 rounded-xl bg-[#05070A] border border-neutral-800 hover:border-[#22D3EE]/40 text-xs text-white whitespace-nowrap transition cursor-pointer font-medium"
                >
                  Why was this flagged?
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => handleQuickPrompt("How does WebShield detect phishing?")}
                  className="px-3 py-1.5 rounded-xl bg-[#05070A] border border-neutral-800 hover:border-[#22D3EE]/40 text-xs text-white whitespace-nowrap transition cursor-pointer font-medium"
                >
                  How does detection work?
                </button>
                <button
                  onClick={() => handleQuickPrompt("What should I do if I clicked a phishing link?")}
                  className="px-3 py-1.5 rounded-xl bg-[#05070A] border border-neutral-800 hover:border-[#22D3EE]/40 text-xs text-white whitespace-nowrap transition cursor-pointer font-medium"
                >
                  Clicked a phishing link?
                </button>
              </>
            )}
          </div>

          {/* Chat Input Form */}
          <form onSubmit={handleSendMessage} className="p-3.5 bg-[#13111C] border-t border-neutral-800 flex items-center gap-2">
            <input
              type="text"
              placeholder="Ask ShieldSense about security..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              disabled={isTyping}
              className="flex-1 bg-[#05070A] border border-neutral-800 focus:border-[#22D3EE] rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-400 focus:outline-none transition disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isTyping || !inputMessage.trim()}
              className="p-3 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#22D3EE] hover:opacity-90 disabled:opacity-50 text-white transition cursor-pointer shadow-md"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          {/* Security Disclaimer */}
          <div className="px-3 py-2 bg-[#05070A] text-[10px] text-neutral-300 font-medium text-center border-t border-neutral-900">
            AI guidance is informational and does not guarantee website safety.
          </div>

        </div>
      )}
    </div>
  );
}