import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Send, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppState';
import { API_URL } from '../config';

const Footer = () => {
  const { showAlert } = useApp();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!newsletterEmail) return;

    setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/api/utils/newsletter`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newsletterEmail })
      });
      const data = await res.json();
      
      if (res.ok) {
        showAlert(data.message, 'success');
        setNewsletterEmail('');
      } else {
        showAlert(data.message || 'Subscription failed.', 'error');
      }
    } catch (err) {
      showAlert('Could not connect to subscription server.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <footer>
      <div className="container">
        <div className="footer-grid">
          {/* Column 1: Brand Info */}
          <div>
            <Link to="/" className="footer-logo" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <img 
                src="/logo.jpg" 
                alt="Shekhawati Collection Logo" 
                style={{ height: '36px', objectFit: 'contain', border: '1px solid rgba(212,175,55,0.3)' }} 
              />
              <span style={{ fontSize: '18px', color: 'var(--color-accent-gold)' }}>Shekhawati Collection</span>
            </Link>
            <p className="footer-desc">
              Bringing royal heritage, hand-crafted wood art, organic herbal secrets, and bespoke handloom outfits from the heart of Shekhawati to the world.
            </p>
            <div className="social-links">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="social-icon" aria-label="Instagram">
                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="social-icon" aria-label="Facebook">
                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
              <span className="social-icon" title="100% Certified Safe & Secure Platform" style={{ cursor: 'default' }}>
                <ShieldCheck size={18} style={{ color: '#D4AF37' }} />
              </span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="footer-heading">Royal Catalog</h4>
            <ul className="footer-links">
              <li><Link to="/shop?category=Wooden Items">Wooden Items</Link></li>
              <li><Link to="/shop?category=Artificial Jewellery">Artificial Jewellery</Link></li>
              <li><Link to="/shop?category=Herbal Products">Herbal Products</Link></li>
              <li><Link to="/shop?category=Ladies Suits">Ladies Suits</Link></li>
              <li><Link to="/track-order">Track My Order</Link></li>
            </ul>
          </div>

          {/* Column 3: Trust & Policies */}
          <div>
            <h4 className="footer-heading">Client Relations</h4>
            <ul className="footer-links">
              <li><Link to="/about">Our Brand Story</Link></li>
              <li><Link to="/faq">Frequently Asked Questions</Link></li>
              <li><Link to="/privacy-policy">Privacy & Cookie Policy</Link></li>
              <li><Link to="/shipping-policy">Shipping & Delivery Policies</Link></li>
              <li><Link to="/refund-policy">Returns & Refund Claims</Link></li>
              <li><Link to="/terms-conditions">Terms & Conditions</Link></li>
            </ul>
          </div>

          {/* Column 4: Contact & Newsletter */}
          <div>
            <h4 className="footer-heading">Royal Newsletter</h4>
            <p style={{ fontSize: '13px', color: 'rgba(252,251,247,0.6)', marginBottom: '15px' }}>
              Subscribe to receive updates on new arrivals, royal stories, and a 10% coupon.
            </p>
            
            <form onSubmit={handleNewsletterSubmit} className="newsletter-form">
              <div className="newsletter-input-container">
                <input
                  type="email"
                  placeholder="Enter email address..."
                  className="newsletter-input"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  required
                />
                <button type="submit" className="newsletter-submit" disabled={submitting}>
                  <Send size={14} />
                </button>
              </div>
            </form>

            <ul className="footer-contact" style={{ listStyle: 'none', marginTop: '25px' }}>
              <li>
                <Phone size={16} className="footer-contact-icon" />
                <span>+91 7732983203</span>
              </li>
              <li>
                <Mail size={16} className="footer-contact-icon" />
                <span style={{ wordBreak: 'break-all' }}>shekhawaticollection@gmail.com</span>
              </li>
              <li>
                <MapPin size={16} className="footer-contact-icon" />
                <span>Shekhawati Region, Rajasthan, India</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="footer-bottom">
          <div>
            <p>© {new Date().getFullYear()} Shekhawati Collection. Hand-crafted with royal care. All rights reserved.</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', color: '#D4AF37' }}>
              🔒 256-Bit SSL Secure Checkout
            </span>
            <div style={{ display: 'flex', gap: '8px', opacity: 0.8 }}>
              {/* Mock credit card badges */}
              <span style={{ backgroundColor: '#fff', padding: '2px 6px', borderRadius: '2px', fontSize: '9px', fontWeight: 'bold', color: '#1A1A1A' }}>VISA</span>
              <span style={{ backgroundColor: '#fff', padding: '2px 6px', borderRadius: '2px', fontSize: '9px', fontWeight: 'bold', color: '#1A1A1A' }}>MC</span>
              <span style={{ backgroundColor: '#fff', padding: '2px 6px', borderRadius: '2px', fontSize: '9px', fontWeight: 'bold', color: '#1A1A1A' }}>AMEX</span>
              <span style={{ backgroundColor: '#fff', padding: '2px 6px', borderRadius: '2px', fontSize: '9px', fontWeight: 'bold', color: '#003087' }}>PayPal</span>
              <span style={{ backgroundColor: '#fff', padding: '2px 6px', borderRadius: '2px', fontSize: '9px', fontWeight: 'bold', color: '#635BFF' }}>Stripe</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
