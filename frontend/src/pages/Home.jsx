import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import NewsletterPopup from '../components/NewsletterPopup';
import { ArrowRight, Star, ShieldCheck, Truck, Sparkles, PhoneCall, Heart, Globe } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';
import { API_URL } from '../config';

const Home = () => {
  const navigate = useNavigate();
  const { formatPrice } = useCurrency();
  const [bestSellers, setBestSellers] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Slides data
  const slides = [
    {
      title: "Royal Sheesham Wood Carvings",
      subtitle: "ARTISANAL DECORATIVE MASTERPIECES",
      desc: "Imbue your chambers with the royal heritage of Rajasthan. Masterpiece chests, trunks, and wall frames, hand-carved in premium Sheesham and mango wood.",
      img: "https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=1600",
      link: "/shop?category=Wooden Items"
    },
    {
      title: "Antique Kundan & Gold Jewellery",
      subtitle: "HAND-CRAFTED ROYAL ORNAMENTS",
      desc: "Delicate bridal choker necklaces, designer Maang Tikkas, and micro gold-plated kada bangles, meticulously detailed with meenakari reverse enameling.",
      img: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1600",
      link: "/shop?category=Artificial Jewellery"
    },
    {
      title: "Royal Maroon Embroidered Outfits",
      subtitle: "PREMIUM HANDLOOM SILK SUITS",
      desc: "Floor-length flared Anarkali suits and classic Jaipuri printed cambric cotton sets, decorated with gold zari lace and hand zardozi stitching.",
      img: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=1600",
      link: "/shop?category=Ladies Suits"
    }
  ];

  // Rotate slides every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  // Fetch best sellers and new arrivals
  useEffect(() => {
    fetch(`${API_URL}/api/products?isBestSeller=true`)
      .then(res => res.json())
      .then(data => setBestSellers(data.slice(0, 4)))
      .catch(err => console.log('Error loading best sellers:', err));

    fetch(`${API_URL}/api/products?isNewArrival=true`)
      .then(res => res.json())
      .then(data => setNewArrivals(data.slice(0, 4)))
      .catch(err => console.log('Error loading new arrivals:', err));
  }, []);

  return (
    <div style={{ position: 'relative' }}>
      
      {/* 1. Hero banner slider */}
      <section className="hero-slider">
        {slides.map((slide, idx) => (
          <div 
            key={idx}
            className={`slide ${idx === currentSlide ? 'active' : ''}`}
            style={{ backgroundImage: `url(${slide.img})` }}
          >
            <div className="slide-content">
              <span className="slide-subtitle">{slide.subtitle}</span>
              <h2 className="slide-title">{slide.title}</h2>
              <p className="slide-desc">{slide.desc}</p>
              <Link to={slide.link} className="btn btn-gold slide-btn">
                Explore Collection
              </Link>
            </div>
          </div>
        ))}
        
        {/* Slider dots */}
        <div className="slider-dots">
          {slides.map((_, idx) => (
            <button 
              key={idx}
              className={`dot ${idx === currentSlide ? 'active' : ''}`}
              onClick={() => setCurrentSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
            ></button>
          ))}
        </div>
      </section>

      {/* 2. Trust Icons Section */}
      <section className="trust-section">
        <div className="container">
          <div className="trust-grid">
            <div className="trust-item">
              <Truck className="trust-icon" />
              <h4>Fast & Safe Delivery</h4>
              <p>Shipped directly to USA, UK, EU, CA, and AU in 5-7 days</p>
            </div>
            <div className="trust-item">
              <ShieldCheck className="trust-icon" />
              <h4>100% Secure Checkout</h4>
              <p>Secure payment via Stripe, PayPal, and Mobile wallets</p>
            </div>
            <div className="trust-item">
              <Sparkles className="trust-icon" />
              <h4>Premium Quality</h4>
              <p>Each item goes through 3 levels of quality inspections</p>
            </div>
            <div className="trust-item">
              <Globe className="trust-icon" />
              <h4>Worldwide Shipping</h4>
              <p>Free global shipping on orders over $150 USD</p>
            </div>
            <div className="trust-item">
              <PhoneCall className="trust-icon" />
              <h4>24/7 Client Relations</h4>
              <p>Responsive customer care via WhatsApp & Live Chat</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Luxury Categories Grid */}
      <section className="section-padding">
        <div className="container">
          <div className="section-header">
            <span className="subtitle">Curated Catalog</span>
            <h2>Royal Categories</h2>
          </div>
          
          <div className="categories-grid">
            {/* Wooden Items */}
            <div className="category-card" onClick={() => navigate('/shop?category=Wooden Items')}>
              <img src="https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=800" alt="Wooden Items" className="category-img" />
              <div className="category-overlay">
                <h3 className="category-title">Wooden Items</h3>
                <span className="category-link">Shop Artworks <ArrowRight size={12} /></span>
              </div>
            </div>

            {/* Artificial Jewellery */}
            <div className="category-card" onClick={() => navigate('/shop?category=Artificial Jewellery')}>
              <img src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800" alt="Artificial Jewellery" className="category-img" />
              <div className="category-overlay">
                <h3 className="category-title">Artificial Jewellery</h3>
                <span className="category-link">Shop Ornaments <ArrowRight size={12} /></span>
              </div>
            </div>

            {/* Herbal Products */}
            <div className="category-card" onClick={() => navigate('/shop?category=Herbal Products')}>
              <img src="https://images.unsplash.com/photo-1608248597481-496100c80836?q=80&w=800" alt="Herbal Products" className="category-img" />
              <div className="category-overlay">
                <h3 className="category-title">Herbal Products</h3>
                <span className="category-link">Shop Wellness <ArrowRight size={12} /></span>
              </div>
            </div>

            {/* Ladies Suits */}
            <div className="category-card" onClick={() => navigate('/shop?category=Ladies Suits')}>
              <img src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=800" alt="Ladies Suits" className="category-img" />
              <div className="category-overlay">
                <h3 className="category-title">Ladies Suits</h3>
                <span className="category-link">Shop Couture <ArrowRight size={12} /></span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Best Selling Products */}
      {bestSellers.length > 0 && (
        <section className="section-padding" style={{ backgroundColor: 'var(--color-bg-white)' }}>
          <div className="container">
            <div className="section-header">
              <span className="subtitle">High Demand</span>
              <h2>Best Selling Products</h2>
            </div>
            
            <div className="products-grid">
              {bestSellers.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 5. Promotional Heritage Ribbon */}
      <section className="section-padding" style={{
        backgroundImage: `linear-gradient(rgba(74, 16, 29, 0.85), rgba(74, 16, 29, 0.85)), url(https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1200)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        color: '#FCFBF7',
        textAlign: 'center'
      }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <span style={{ color: '#D4AF37', letterSpacing: '4px', textTransform: 'uppercase', fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '15px' }}>
            Limited Heritage Promo
          </span>
          <h2 style={{ fontSize: '40px', color: '#FFF', marginBottom: '20px' }}>Save $50 on Royal Gold Orders</h2>
          <p style={{ fontSize: '16px', color: 'rgba(252, 251, 247, 0.8)', marginBottom: '35px', lineHeight: 1.6 }}>
            Use coupon code <span style={{ color: '#D4AF37', fontWeight: 'bold' }}>ROYALGOLD</span> at checkout to receive a flat $50 USD discount on all orders above $250 USD. Claim your heirloom piece today.
          </p>
          <Link to="/shop" className="btn btn-gold">
            Shop Royal Collections
          </Link>
        </div>
      </section>

      {/* 6. New Arrivals Section */}
      {newArrivals.length > 0 && (
        <section className="section-padding">
          <div className="container">
            <div className="section-header">
              <span className="subtitle">Fresh Creations</span>
              <h2>New Arrivals</h2>
            </div>
            
            <div className="products-grid">
              {newArrivals.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 7. Newsletter Popup (triggred automatically in 5s) */}
      <NewsletterPopup />
    </div>
  );
};

export default Home;
