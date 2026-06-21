import React, { useState, useEffect } from 'react';
import { X, Mail } from 'lucide-react';
import { useApp } from '../context/AppState';
import { API_URL } from '../config';

const NewsletterPopup = () => {
  const { showAlert } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Show newsletter modal after 5 seconds if they haven't seen it yet
    const hasSeen = localStorage.getItem('sc_newsletter_seen');
    if (!hasSeen) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem('sc_newsletter_seen', 'true');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/api/utils/newsletter`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      
      if (res.ok) {
        showAlert(data.message, 'success');
        handleClose();
      } else {
        showAlert(data.message || 'Subscription failed.', 'error');
      }
    } catch (err) {
      showAlert('Connection to server failed.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={`modal-overlay ${isOpen ? 'open' : ''}`}>
      <div className="newsletter-modal">
        <button className="close-modal-btn" onClick={handleClose} aria-label="Close Modal">
          <X size={20} />
        </button>
        
        {/* Left Side: Royalty Theme Graphic Cover */}
        <div className="newsletter-modal-left">
          <img 
            src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800" 
            alt="Royal Kundan Jewellery" 
          />
        </div>

        {/* Right Side: Signup Form */}
        <div className="newsletter-modal-right">
          <span style={{
            fontSize: '11px',
            color: '#D4AF37',
            letterSpacing: '3px',
            textTransform: 'uppercase',
            fontWeight: 600,
            marginBottom: '10px',
            display: 'block'
          }}>
            Exclusive Invitation
          </span>
          <h2 style={{
            fontSize: '26px',
            color: '#6B1D2F',
            lineHeight: 1.2,
            marginBottom: '12px',
            fontWeight: 500
          }}>
            Join the Royal Club
          </h2>
          <p style={{
            fontSize: '13px',
            color: '#767676',
            marginBottom: '25px',
            lineHeight: 1.5
          }}>
            Subscribe to our newsletter to receive invitations to private sales, early access to new arrivals, and <span style={{ color: '#6B1D2F', fontWeight: 600 }}>10% Off your first order</span>.
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              border: '1px solid #E5D5B3',
              padding: '10px 14px',
              backgroundColor: '#fff'
            }}>
              <Mail size={16} style={{ color: '#767676', marginRight: '10px' }} />
              <input
                type="email"
                placeholder="Enter your email address..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  border: 'none',
                  outline: 'none',
                  fontSize: '14px',
                  width: '100%'
                }}
              />
            </div>
            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{ width: '100%', padding: '12px' }}
              disabled={submitting}
            >
              {submitting ? 'Subscribing...' : 'Claim 10% Discount'}
            </button>
          </form>

          <button 
            onClick={handleClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#767676',
              fontSize: '11px',
              textDecoration: 'underline',
              marginTop: '15px',
              cursor: 'pointer'
            }}
          >
            No thanks, I prefer paying full price
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewsletterPopup;
