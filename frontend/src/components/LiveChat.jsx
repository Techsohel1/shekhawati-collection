import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, User } from 'lucide-react';
import { API_URL } from '../config';

const LiveChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'agent',
      text: 'Greetings from Shekhawati Collection Client Relations. How may we assist you with our royal catalog today?'
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  // Auto-scroll chat to latest messages
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: message
    };

    setMessages(prev => [...prev, userMsg]);
    const currentMsgText = message;
    setMessage('');
    
    // Simulate thinking delay
    setIsTyping(true);

    try {
      const res = await fetch(`${API_URL}/api/utils/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: currentMsgText })
      });
      
      const data = await res.json();
      
      setTimeout(() => {
        setIsTyping(false);
        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          sender: 'agent',
          text: data.reply || 'Thank you for reaching out. A representative will contact you shortly.'
        }]);
      }, 800); // 800ms natural delay
      
    } catch (err) {
      setTimeout(() => {
        setIsTyping(false);
        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          sender: 'agent',
          text: "We apologize, our chat servers are currently experiencing heavy traffic. Please call us at +91 7732983203 or email shekhawaticollection@gmail.com for instant assistance!"
        }]);
      }, 800);
    }
  };

  return (
    <div className="chat-widget-container">
      {/* Floating Chat Bubble */}
      <button 
        className="chat-bubble" 
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open Chat Help"
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </button>

      {/* Expandable Chat Window */}
      {isOpen && (
        <div className="chat-window">
          {/* Header */}
          <div className="chat-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#22C55E'
              }}></div>
              <span style={{ fontWeight: 600, fontSize: '14px', letterSpacing: '0.5px' }}>Royal Client Relations</span>
            </div>
            <span style={{ fontSize: '10px', color: '#D4AF37', border: '1px solid #D4AF37', padding: '2px 6px', borderRadius: '10px', textTransform: 'uppercase' }}>
              24/7 Active
            </span>
          </div>

          {/* Messages Body */}
          <div className="chat-body">
            {messages.map(msg => (
              <div key={msg.id} className={`chat-msg ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
            {isTyping && (
              <div className="chat-msg agent" style={{ display: 'flex', gap: '4px', padding: '12px' }}>
                <span style={{ animation: 'fadeIn 1s infinite', fontWeight: 'bold' }}>•</span>
                <span style={{ animation: 'fadeIn 1s infinite 0.2s', fontWeight: 'bold' }}>•</span>
                <span style={{ animation: 'fadeIn 1s infinite 0.4s', fontWeight: 'bold' }}>•</span>
              </div>
            )}
            <div ref={chatEndRef}></div>
          </div>

          {/* Input Footer */}
          <form onSubmit={handleSendMessage} className="chat-footer-input">
            <input
              type="text"
              placeholder="Ask about shipping, returns, products..."
              className="chat-input"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
            <button type="submit" className="chat-send-btn">
              <Send size={14} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default LiveChat;
