import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, HelpCircle, ChevronDown, ShieldCheck, HeartHandshake, Eye } from 'lucide-react';
import { useApp } from '../context/AppState';

// ==========================================
// 1. ABOUT US VIEW
// ==========================================
export const AboutUs = () => {
  return (
    <div className="container section-padding" style={{ maxWidth: '800px' }}>
      <div className="section-header">
        <span className="subtitle">Our Heritage</span>
        <h2>About Shekhawati Collection</h2>
      </div>
      
      <div style={{ fontSize: '15px', color: '#767676', lineHeight: 1.8, display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <p>
          Founded in the historic desert region of Rajasthan, India, <strong style={{ color: '#1C1C1C' }}>Shekhawati Collection</strong> was born out of a desire to preserve and share the majestic heritage of royal Indian craftsmanship with clients worldwide.
        </p>
        <div style={{ height: '300px', margin: '15px 0', overflow: 'hidden' }}>
          <img 
            src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800" 
            alt="Rajasthani Artisans Block Printing" 
            style={{ width: '100%', height: '100%', objectFit: 'cover', border: '1px solid #E5D5B3' }}
          />
        </div>
        <p>
          Our name represents the Shekhawati area, celebrated globally for its fresco-painted Havelis, exquisite hand-carved furniture, and unique ethnic artistry. Every wooden chest, Kundan bridal choker set, or handloom ladies suit in our catalog is crafted by skilled master artisans who have inherited these traditional techniques from their ancestors.
        </p>
        <p>
          We target customers seeking true luxury and authenticity in the <strong style={{ color: '#6B1D2F' }}>USA, UK, Europe, Canada, and Australia</strong>. By bypassing middlemen, we guarantee that our artisans receive fair trade wages directly, while delivering heirloom-quality items that build lifetime trust.
        </p>
      </div>
    </div>
  );
};

// ==========================================
// 2. CONTACT US VIEW
// ==========================================
export const ContactUs = () => {
  const { showAlert } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      showAlert('Thank you! Your message has been sent to our client relations desk.', 'success');
      setName('');
      setEmail('');
      setMsg('');
      setSubmitting(false);
    }, 1000);
  };

  return (
    <div className="container section-padding">
      <div className="section-header">
        <span className="subtitle">Get in Touch</span>
        <h2>Contact Us</h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '50px', alignItems: 'flex-start' }}>
        {/* Contact Form */}
        <div style={{ backgroundColor: '#fff', border: '1px solid #E5D5B3', padding: '30px' }}>
          <h3 style={{ color: '#6B1D2F', fontSize: '18px', marginBottom: '20px', borderBottom: '1px solid #F0EDE4', paddingBottom: '10px' }}>
            Send Us a Message
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input type="text" className="form-control" required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Sarah Jenkins" />
            </div>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input type="email" className="form-control" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="e.g. client@domain.com" />
            </div>
            <div className="form-group">
              <label className="form-label">Message Details</label>
              <textarea className="form-control" rows="5" required value={msg} onChange={(e) => setMsg(e.target.value)} placeholder="Inquire about custom furniture sizes, bulk ordering, or shipment timelines..."></textarea>
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px' }} disabled={submitting}>
              {submitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>

        {/* Brand details and address */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          <div style={{ backgroundColor: '#FCFBF7', border: '1px solid #E5D5B3', padding: '25px' }}>
            <h3 style={{ color: '#6B1D2F', fontSize: '18px', marginBottom: '15px' }}>Contact Details</h3>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '15px', fontSize: '14px' }}>
              <li style={{ display: 'flex', gap: '10px' }}>
                <Phone size={18} style={{ color: '#D4AF37' }} />
                <span>+91 7732983203 (Direct call / WhatsApp support)</span>
              </li>
              <li style={{ display: 'flex', gap: '10px' }}>
                <Mail size={18} style={{ color: '#D4AF37' }} />
                <span style={{ wordBreak: 'break-all' }}>shekhawaticollection@gmail.com</span>
              </li>
              <li style={{ display: 'flex', gap: '10px' }}>
                <MapPin size={18} style={{ color: '#D4AF37' }} />
                <span>Rajasthan Heritage Depot, Shekhawati Region, Rajasthan, India</span>
              </li>
            </ul>
          </div>
          
          <div style={{
            height: '250px',
            backgroundColor: '#F3EFE0',
            border: '1px dashed #E5D5B3',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#767676',
            fontSize: '13px'
          }}>
            📍 Rajasthani Artisan Workshops Map Placeholder
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 3. FAQ VIEW (Collapsible Accordion)
// ==========================================
export const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const faqItems = [
    {
      q: "Which countries do you ship to?",
      a: "We ship directly to the United States, United Kingdom, Europe, Canada, and Australia. Standard tracking updates are emailed immediately after dispatch."
    },
    {
      q: "What is your shipping cost and estimated delivery time?",
      a: "We offer worldwide shipping via premium priority air cargo. Delivery typically takes 5 to 7 business days. Shipping is $15 USD flat, but orders over $150 USD are eligible for FREE global shipping."
    },
    {
      q: "Are the wood materials durable?",
      a: "Yes, our Wooden Items are hand-crafted using premium seasoned Indian Rosewood (Sheesham) and Mango Wood. The timber is fully treated against moisture and wood parasites, built to last generations."
    },
    {
      q: "How should I care for Kundan jewelry?",
      a: "To preserve the 22k/24k micro gold plating, avoid direct exposure to perfumes, sanitizers, or water. Store the jewellery in airtight velvet-lined bags provided in our boxes."
    },
    {
      q: "What is your return policy?",
      a: "Shekhawati Collection commits to absolute luxury satisfaction. We offer a 30-day return policy for unused items in original packaging. Please reach out to client relations to claim returns."
    }
  ];

  return (
    <div className="container section-padding" style={{ maxWidth: '800px' }}>
      <div className="section-header">
        <span className="subtitle">Help Center</span>
        <h2>Frequently Asked Questions</h2>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {faqItems.map((item, idx) => (
          <div 
            key={idx} 
            style={{ 
              backgroundColor: '#fff', 
              border: '1px solid #E5D5B3', 
              borderRadius: '2px',
              overflow: 'hidden'
            }}
          >
            {/* Header Accordion */}
            <div 
              onClick={() => setOpenIndex(openIndex === idx ? -1 : idx)}
              style={{
                padding: '18px 25px',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: openIndex === idx ? '#F9F5EA' : 'transparent',
                transition: 'background-color 0.3s'
              }}
            >
              <h4 style={{ fontSize: '15px', fontWeight: 600, color: openIndex === idx ? '#6B1D2F' : '#1C1C1C' }}>{item.q}</h4>
              <ChevronDown 
                size={16} 
                style={{ 
                  transform: openIndex === idx ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.3s' 
                }} 
              />
            </div>

            {/* Collapsible Content */}
            {openIndex === idx && (
              <div style={{
                padding: '20px 25px',
                borderTop: '1px solid #F0EDE4',
                fontSize: '14px',
                color: '#767676',
                lineHeight: 1.6,
                backgroundColor: '#FFF',
                animation: 'fadeInUp 0.3s ease'
              }}>
                {item.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// 4. PRIVACY POLICY
// ==========================================
export const PrivacyPolicy = () => (
  <div className="container section-padding" style={{ maxWidth: '800px' }}>
    <div className="section-header">
      <span className="subtitle">Security Policy</span>
      <h2>Privacy Policy</h2>
    </div>
    <div style={{ fontSize: '14px', color: '#767676', lineHeight: 1.7 }} className="footer-links">
      <p style={{ marginBottom: '15px' }}>Last updated: June 21, 2026</p>
      <p style={{ marginBottom: '15px' }}>
        Shekhawati Collection is committed to protecting your privacy. We collect billing, shipping, and email details solely to process secure international checkouts and provide customer relations support. We do not sell or trade your details with external data farms.
      </p>
      <p style={{ marginBottom: '15px' }}>
        We integrate secure checkout gateways like Stripe and PayPal, which protect financial credentials with advanced end-to-end tokenization. Browsing cookies are used to cache currency preferences and cart items.
      </p>
    </div>
  </div>
);

// ==========================================
// 5. RETURN & REFUND POLICY
// ==========================================
export const ReturnRefundPolicy = () => (
  <div className="container section-padding" style={{ maxWidth: '800px' }}>
    <div className="section-header">
      <span className="subtitle">Satisfaction Guarantee</span>
      <h2>Return & Refund Policy</h2>
    </div>
    <div style={{ fontSize: '14px', color: '#767676', lineHeight: 1.7 }}>
      <p style={{ marginBottom: '15px' }}>
        We take extreme pride in our Rajasthani handcrafts. If an item does not meet your expectations, we accept returns within <strong style={{ color: '#1C1C1C' }}>30 Days</strong> of delivery.
      </p>
      <p style={{ marginBottom: '15px' }}>
        To qualify for return, items must be in original packaging, unused, and undamaged. Once inspected, refund credits will be disbursed to your initial payment method (Visa, Mastercard, Amex, PayPal) within 5 business days. Please contact us at shekhawaticollection@gmail.com to initiate claims.
      </p>
    </div>
  </div>
);

// ==========================================
// 6. SHIPPING POLICY
// ==========================================
export const ShippingPolicy = () => (
  <div className="container section-padding" style={{ maxWidth: '800px' }}>
    <div className="section-header">
      <span className="subtitle">Worldwide Logistics</span>
      <h2>Shipping Policy</h2>
    </div>
    <div style={{ fontSize: '14px', color: '#767676', lineHeight: 1.7 }}>
      <p style={{ marginBottom: '15px' }}>
        We offer worldwide shipping with tracking to our core target audiences in the <strong style={{ color: '#1C1C1C' }}>United States, United Kingdom, Europe, Canada, and Australia</strong>.
      </p>
      <p style={{ marginBottom: '15px' }}>
        All packages are dispatched from our royal logistics depot in Rajasthan, India. Air transit takes 5 to 7 business days. Customs clearances are managed efficiently. Shipping is free for orders over $150 USD, or a flat fee of $15 USD for smaller cart checkouts.
      </p>
    </div>
  </div>
);

// ==========================================
// 7. TERMS & CONDITIONS
// ==========================================
export const TermsConditions = () => (
  <div className="container section-padding" style={{ maxWidth: '800px' }}>
    <div className="section-header">
      <span className="subtitle">Agreement Details</span>
      <h2>Terms & Conditions</h2>
    </div>
    <div style={{ fontSize: '14px', color: '#767676', lineHeight: 1.7 }}>
      <p style={{ marginBottom: '15px' }}>
        By browsing or ordering from Shekhawati Collection, you agree to our standard terms of service. Products are subject to stock availability. Because items are handcrafted, slight variations in wood grains or jewelry beads are natural and represent authentic artisan uniqueness.
      </p>
      <p style={{ marginBottom: '15px' }}>
        We reserve the right to modify prices or terminate discount campaigns at our discretion. All logo text, layouts, and product copy are intellectual property of Shekhawati Collection.
      </p>
    </div>
  </div>
);
