import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Sparkles, User, ShoppingBag } from 'lucide-react';

const WhatsAppWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: 'Welcome to the Montclair Atelier. I am your concierge styling and sizing advisor. How may I assist your style curation today?',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Show prompt inviting the user to chat after 5 seconds
    const timer = setTimeout(() => {
      setShowPrompt(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  // Auto-scroll to latest message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const simulateBotResponse = (userText) => {
    setIsTyping(true);
    
    setTimeout(() => {
      let responseText = "";
      let customElements = null;

      const lowerText = userText.toLowerCase();

      if (lowerText.includes('size') || lowerText.includes('fit') || lowerText.includes('recommendation')) {
        responseText = "To recommend your ideal silhouette size, please enter your height (cm) and weight (kg), or click one of our quick sizing profiles:";
        customElements = (
          <div className="flex flex-wrap gap-2 mt-3">
            <button 
              onClick={() => handleQuickMessage("Recommend size for 60kg")} 
              className="text-[9px] uppercase tracking-wider bg-brand-white/10 hover:bg-brand-gold hover:text-brand-black text-brand-beige border border-brand-beige/20 px-3 py-1.5 transition-luxury"
            >
              {"Slim Fit (< 62kg)"}
            </button>
            <button 
              onClick={() => handleQuickMessage("Recommend size for 70kg")} 
              className="text-[9px] uppercase tracking-wider bg-brand-white/10 hover:bg-brand-gold hover:text-brand-black text-brand-beige border border-brand-beige/20 px-3 py-1.5 transition-luxury"
            >
              Regular Fit (62 - 73kg)
            </button>
            <button 
              onClick={() => handleQuickMessage("Recommend size for 80kg")} 
              className="text-[9px] uppercase tracking-wider bg-brand-white/10 hover:bg-brand-gold hover:text-brand-black text-brand-beige border border-brand-beige/20 px-3 py-1.5 transition-luxury"
            >
              Classic Draped Fit (74 - 85kg)
            </button>
            <button 
              onClick={() => handleQuickMessage("Recommend size for 90kg")} 
              className="text-[9px] uppercase tracking-wider bg-brand-white/10 hover:bg-brand-gold hover:text-brand-black text-brand-beige border border-brand-beige/20 px-3 py-1.5 transition-luxury"
            >
              {"Oversized Silhouette (> 85kg)"}
            </button>
          </div>
        );
      } else if (lowerText.includes('60kg') || lowerText.includes('60 kg') || lowerText.includes('slim')) {
        responseText = "Based on our Atelier styling index, we recommend Size **S (Small)**. It maintains our sharp tailoring shoulder lines while draping elegantly.";
      } else if (lowerText.includes('70kg') || lowerText.includes('70 kg') || lowerText.includes('regular')) {
        responseText = "Based on our Atelier styling index, we recommend Size **M (Medium)** for structured, timeless comfort.";
      } else if (lowerText.includes('80kg') || lowerText.includes('80 kg') || lowerText.includes('classic')) {
        responseText = "Based on our Atelier styling index, we recommend Size **L (Large)** to maintain a relaxed but polished silhouette.";
      } else if (lowerText.includes('90kg') || lowerText.includes('90 kg') || lowerText.includes('oversized')) {
        responseText = "Based on our Atelier styling index, we recommend Size **XL (Extra Large)** for a creative, structural drop-shoulder drape.";
      } else if (lowerText.includes('style') || lowerText.includes('styling') || lowerText.includes('wear') || lowerText.includes('outfit')) {
        responseText = "For a classic quiet luxury look, we recommend styling our **Merino Wool Knit Blazer** paired with **Pleated Tailored Trousers** and a **Pima Cotton Oversized Tee** in Warm Beige. This combination merges structured lines with effortless comfort.";
      } else if (lowerText.includes('track') || lowerText.includes('order') || lowerText.includes('status')) {
        // Query recent orders from local storage
        const localOrders = localStorage.getItem('montclair_orders');
        if (localOrders) {
          try {
            const orders = JSON.parse(localOrders);
            if (orders && orders.length > 0) {
              const latest = orders[orders.length - 1];
              responseText = `I located your recent order **#${latest.orderNumber}** ($${latest.total.toFixed(2)}). Status: **${latest.status || 'Processing'}**.\nTracking reference: \`${latest.trackingNumber || 'Pending Dispatch'}\`.`;
            } else {
              responseText = "I couldn't locate any recent orders in this session. If you placed a purchase, please make sure you are logged in, or write your custom order reference (e.g. '#1001').";
            }
          } catch (e) {
            responseText = "I found an issue retrieving order databases. Please log into your client dashboard to view dispatch codes.";
          }
        } else {
          responseText = "No active orders found in your browser history. You can inspect previous purchases directly in your [Customer Account Dashboard](/account).";
        }
      } else if (lowerText.includes('agent') || lowerText.includes('whatsapp') || lowerText.includes('human') || lowerText.includes('call')) {
        responseText = "Of course. I am redirecting your request to a live styling advisor on our direct WhatsApp line. Click the link below to launch connection:";
        customElements = (
          <a 
            href="https://wa.me/1234567890?text=Hello%20Montclair,%20I%20would%20like%20some%20concierge%20styling%20assistance."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 mt-2 bg-brand-gold hover:bg-brand-beige text-brand-black px-4 py-2 text-[10px] font-bold uppercase tracking-wider transition-luxury"
          >
            <span>Launch WhatsApp Line</span>
          </a>
        );
      } else {
        responseText = "I will pass your styling inquiry to our atelier team. You can search our active collections, track sizing, or speak directly with a concierge associate by typing 'agent'.";
      }

      setMessages(prev => [
        ...prev,
        {
          id: prev.length + 1,
          sender: 'bot',
          text: responseText,
          customElements: customElements,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setIsTyping(false);
    }, 1200);
  };

  const handleSendMessage = (e) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    const userMsgText = inputText;
    setMessages(prev => [
      ...prev,
      {
        id: prev.length + 1,
        sender: 'user',
        text: userMsgText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setInputText('');
    simulateBotResponse(userMsgText);
  };

  const handleQuickMessage = (text) => {
    setMessages(prev => [
      ...prev,
      {
        id: prev.length + 1,
        sender: 'user',
        text: text,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    simulateBotResponse(text);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      
      {/* Floating Concierge Invite Prompt */}
      <AnimatePresence>
        {showPrompt && !isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-brand-black text-brand-white border border-brand-beige/25 p-4 mb-3 shadow-2xl max-w-xs text-left relative"
          >
            <button 
              onClick={() => setShowPrompt(false)} 
              className="absolute top-2 right-2 text-brand-midgrey hover:text-brand-white transition-luxury"
              aria-label="Close concierge invitation"
            >
              <X className="w-3.5 h-3.5" />
            </button>
            <span className="text-[9px] uppercase tracking-widest text-brand-gold font-bold block mb-1">Montclair Concierge</span>
            <p className="text-[10px] text-brand-lightgrey leading-relaxed font-sans font-light pr-4">
              Need assistance with styling or sizing? Chat live with our Atelier advisor.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Chatbot Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="w-[340px] sm:w-[380px] h-[480px] bg-brand-black/95 border border-brand-beige/20 shadow-2xl flex flex-col overflow-hidden mb-4 relative"
          >
            {/* Header */}
            <div className="p-4 border-b border-brand-beige/10 flex items-center justify-between bg-brand-black">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full border border-brand-gold/40 flex items-center justify-center bg-brand-darkgrey text-brand-gold">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-brand-beige">Atelier Concierge</h3>
                  <span className="text-[9px] text-brand-gold uppercase tracking-wider block font-light">Online • Style & Fit Advisor</span>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-brand-midgrey hover:text-brand-white transition-luxury"
                aria-label="Close Chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chat History Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs font-sans font-light">
              {messages.map((msg) => (
                <div 
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start space-x-2 max-w-[80%] ${msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : 'flex-row'}`}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center border text-[9px] ${
                      msg.sender === 'user' 
                        ? 'border-brand-beige/30 bg-brand-beige/10 text-brand-beige' 
                        : 'border-brand-gold/30 bg-brand-darkgrey text-brand-gold'
                    }`}>
                      {msg.sender === 'user' ? <User className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
                    </div>
                    <div className="flex flex-col">
                      <div className={`p-3 text-left whitespace-pre-wrap leading-relaxed ${
                        msg.sender === 'user' 
                          ? 'bg-brand-beige text-brand-black font-medium' 
                          : 'bg-brand-darkgrey text-brand-lightgrey border border-brand-beige/10'
                      }`}>
                        {msg.text}
                        {msg.customElements}
                      </div>
                      <span className={`text-[8px] mt-1 tracking-wider text-brand-midgrey uppercase ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                        {msg.time}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {/* Bot Typing Indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-center space-x-2 bg-brand-darkgrey border border-brand-beige/10 p-3 rounded-none max-w-[80%]">
                    <span className="w-1.5 h-1.5 bg-brand-gold rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-brand-gold rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-brand-gold rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Replies Helper Options */}
            {messages.length === 1 && (
              <div className="px-4 py-2 border-t border-brand-beige/5 bg-brand-darkgrey/30 text-left">
                <span className="text-[8px] uppercase tracking-widest text-brand-midgrey block mb-2">Suggested Inquiries</span>
                <div className="flex flex-wrap gap-2">
                  <button 
                    onClick={() => handleQuickMessage("Suggest sizing")} 
                    className="text-[9px] uppercase tracking-wider border border-brand-gold/30 hover:border-brand-gold text-brand-gold hover:text-brand-white bg-transparent px-3 py-1.5 transition-luxury"
                  >
                    📏 Size Advisor
                  </button>
                  <button 
                    onClick={() => handleQuickMessage("Outfit styling recommendations")} 
                    className="text-[9px] uppercase tracking-wider border border-brand-gold/30 hover:border-brand-gold text-brand-gold hover:text-brand-white bg-transparent px-3 py-1.5 transition-luxury"
                  >
                    👔 Styling Advice
                  </button>
                  <button 
                    onClick={() => handleQuickMessage("Track my order")} 
                    className="text-[9px] uppercase tracking-wider border border-brand-gold/30 hover:border-brand-gold text-brand-gold hover:text-brand-white bg-transparent px-3 py-1.5 transition-luxury"
                  >
                    📦 Track Order
                  </button>
                  <button 
                    onClick={() => handleQuickMessage("Talk to a human agent")} 
                    className="text-[9px] uppercase tracking-wider border border-brand-gold/30 hover:border-brand-gold text-brand-gold hover:text-brand-white bg-transparent px-3 py-1.5 transition-luxury"
                  >
                    💬 Live Assistant
                  </button>
                </div>
              </div>
            )}

            {/* Input Form Bar */}
            <form onSubmit={handleSendMessage} className="p-3 bg-brand-black border-t border-brand-beige/10 flex items-center space-x-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="MESSAGE THE ATELIER..."
                className="flex-1 bg-brand-darkgrey border border-brand-beige/10 px-3 py-2 text-xs focus:outline-none focus:border-brand-gold uppercase tracking-wider text-brand-beige placeholder-brand-midgrey"
              />
              <button 
                type="submit" 
                className="bg-brand-gold hover:bg-brand-beige text-brand-black p-2.5 transition-luxury cursor-pointer"
                aria-label="Send message"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Assist Trigger Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="bg-brand-black hover:bg-brand-beige hover:text-brand-black text-brand-beige border border-brand-gold/30 p-4 rounded-full shadow-2xl flex items-center justify-center transition-luxury cursor-pointer"
        aria-label="Toggle Concierge Chatbot"
      >
        {isOpen ? (
          <X className="w-5 h-5 stroke-[1.5]" />
        ) : (
          <MessageSquare className="w-5 h-5 stroke-[1.5]" />
        )}
      </motion.button>

    </div>
  );
};

export default WhatsAppWidget;
