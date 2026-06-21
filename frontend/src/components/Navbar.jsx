import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppState';
import { useCurrency } from '../context/CurrencyContext';
import { Search, ShoppingBag, Heart, User, X, Plus, Minus, Globe, LogOut, GitCompare, LayoutDashboard } from 'lucide-react';
import { API_URL } from '../config';

const Navbar = () => {
  const { cart, wishlist, compareList, user, logout, updateQuantity, removeFromCart } = useApp();
  const { currency, changeCurrency, formatPrice } = useCurrency();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('US');
  const suggestionRef = useRef(null);

  // Countries targeting
  const countries = [
    { code: 'US', name: 'United States', flag: '🇺🇸' },
    { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
    { code: 'EU', name: 'Europe', flag: '🇪🇺' },
    { code: 'CA', name: 'Canada', flag: '🇨🇦' },
    { code: 'AU', name: 'Australia', flag: '🇦🇺' }
  ];

  // Fetch all products for search autocomplete simulation
  useEffect(() => {
    fetch(`${API_URL}/api/products`)
      .then(res => res.json())
      .then(data => setAllProducts(data))
      .catch(err => console.log('Error pre-loading products for navbar search:', err));
  }, []);

  // Handle autocomplete filtering
  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      const query = searchQuery.toLowerCase();
      const filtered = allProducts.filter(p => 
        p.name.toLowerCase().includes(query) || 
        p.category.toLowerCase().includes(query)
      ).slice(0, 5);
      setSearchSuggestions(filtered);
    } else {
      setSearchSuggestions([]);
    }
  }, [searchQuery, allProducts]);

  // Close search suggestions on clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (suggestionRef.current && !suggestionRef.current.contains(e.target)) {
        setSearchSuggestions([]);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
      setSearchSuggestions([]);
    }
  };

  const handleSuggestionClick = (productId) => {
    navigate(`/product/${productId}`);
    setSearchQuery('');
    setSearchSuggestions([]);
  };

  const cartSubtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <>
      {/* Top bar with country selector and currency manager */}
      <div className="top-bar">
        <div className="container top-bar-inner">
          <div>
            <span>✨ Royal Rajasthani Craftsmanship — Free International Shipping over $150 USD</span>
          </div>
          <div className="top-bar-right">
            {/* Country Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Globe size={13} style={{ color: '#D4AF37' }} />
              <select 
                value={selectedCountry} 
                onChange={(e) => {
                  setSelectedCountry(e.target.value);
                  // Auto switch currency match
                  const countryToCurrency = { US: 'USD', GB: 'GBP', EU: 'EUR', CA: 'CAD', AU: 'AUD' };
                  changeCurrency(countryToCurrency[e.target.value]);
                }}
              >
                {countries.map(c => (
                  <option key={c.code} value={c.code}>{c.flag} {c.name}</option>
                ))}
              </select>
            </div>
            
            {/* Currency Switcher */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ color: '#D4AF37', fontWeight: 600 }}>Currency:</span>
              <select value={currency} onChange={(e) => changeCurrency(e.target.value)}>
                <option value="USD">USD ($)</option>
                <option value="GBP">GBP (£)</option>
                <option value="EUR">EUR (€)</option>
                <option value="CAD">CAD (C$)</option>
                <option value="AUD">AUD (A$)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Luxury Header */}
      <header className="header-main">
        <div className="container header-inner">
          {/* Brand Logo & Label */}
          <Link to="/" className="logo" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img 
              src="/logo.jpg" 
              alt="Shekhawati Collection Logo" 
              style={{ height: '48px', objectFit: 'contain', border: '1px solid var(--color-border-gold)', borderRadius: '2px' }} 
            />
            <span style={{ fontSize: '20px', textShadow: 'none' }}>Shekhawati Collection</span>
          </Link>

          {/* Navigation Links */}
          <nav>
            <ul className="nav-links">
              <li>
                <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link>
              </li>
              <li>
                <Link to="/shop" className={location.pathname === '/shop' ? 'active' : ''}>Shop</Link>
              </li>
              <li>
                <Link to="/blog" className={location.pathname === '/blog' ? 'active' : ''}>Blog</Link>
              </li>
              <li>
                <Link to="/about" className={location.pathname === '/about' ? 'active' : ''}>About Us</Link>
              </li>
              <li>
                <Link to="/contact" className={location.pathname === '/contact' ? 'active' : ''}>Contact Us</Link>
              </li>
              <li>
                <Link to="/track-order" className={location.pathname === '/track-order' ? 'active' : ''}>Track Order</Link>
              </li>
            </ul>
          </nav>

          {/* Header Action Elements */}
          <div className="header-actions" ref={suggestionRef}>
            {/* Realtime Autocomplete search */}
            <form onSubmit={handleSearchSubmit} className="search-container" style={{ position: 'relative' }}>
              <Search size={16} style={{ color: '#767676' }} />
              <input
                type="text"
                placeholder="AI-powered Product search..."
                className="search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              
              {/* Autocomplete Autocomplete Dropdown list */}
              {searchSuggestions.length > 0 && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  width: '100%',
                  backgroundColor: '#ffffff',
                  border: '1px solid #E5D5B3',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
                  zIndex: 999,
                  marginTop: '5px',
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  {searchSuggestions.map(suggestion => (
                    <div
                      key={suggestion._id}
                      onClick={() => handleSuggestionClick(suggestion._id)}
                      style={{
                        padding: '10px 15px',
                        cursor: 'pointer',
                        borderBottom: '1px solid #F0EDE4',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        transition: 'background-color 0.2s'
                      }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#F9F5EA'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                    >
                      <img 
                        src={suggestion.images[0]} 
                        alt={suggestion.name} 
                        style={{ width: '30px', height: '35px', objectFit: 'cover' }} 
                      />
                      <div>
                        <div style={{ fontSize: '12px', fontWeight: 500, color: '#1C1C1C' }}>{suggestion.name}</div>
                        <div style={{ fontSize: '11px', color: '#6B1D2F', fontWeight: 600 }}>{formatPrice(suggestion.price)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </form>

            {/* Comparisons list Link */}
            {compareList.length > 0 && (
              <span className="action-icon" style={{ cursor: 'default' }}>
                <GitCompare size={20} />
                <span className="badge">{compareList.length}</span>
              </span>
            )}

            {/* Wishlist Link */}
            <Link to="/profile?tab=wishlist" className="action-icon">
              <Heart size={20} />
              {wishlist.length > 0 && <span className="badge">{wishlist.length}</span>}
            </Link>

            {/* User Login/Account actions */}
            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                {user.role === 'admin' ? (
                  <Link to="/admin" className="action-icon" title="Admin Dashboard" style={{ color: '#D4AF37' }}>
                    <LayoutDashboard size={20} />
                  </Link>
                ) : (
                  <Link to="/profile" className="action-icon" title="My Profile">
                    <User size={20} />
                  </Link>
                )}
                <button onClick={logout} className="action-icon" title="Logout" style={{ background: 'none', border: 'none' }}>
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <Link to="/profile" className="action-icon" title="Login / Signup">
                <User size={20} />
              </Link>
            )}

            {/* Cart trigger button */}
            <button onClick={() => setIsCartOpen(true)} className="action-icon">
              <ShoppingBag size={20} />
              {cart.length > 0 && <span className="badge">{cart.length}</span>}
            </button>
          </div>
        </div>
      </header>

      {/* Mini Cart Drawer Sidebar */}
      <div className={`drawer-backdrop ${isCartOpen ? 'open' : ''}`} onClick={() => setIsCartOpen(false)}></div>
      <div className={`cart-drawer ${isCartOpen ? 'open' : ''}`}>
        <div className="cart-header">
          <h3>Shopping Cart ({cart.length})</h3>
          <button className="cart-close-btn" onClick={() => setIsCartOpen(false)}>
            <X size={24} />
          </button>
        </div>

        {/* Drawer Scrollable Items */}
        <div className="cart-items">
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', marginTop: '50px', color: '#767676' }}>
              <ShoppingBag size={48} style={{ color: '#E5D5B3', marginBottom: '15px' }} />
              <p>Your luxury cart is currently empty.</p>
              <button 
                className="btn btn-primary btn-sm" 
                style={{ marginTop: '20px' }}
                onClick={() => { setIsCartOpen(false); navigate('/shop'); }}
              >
                Browse Shop
              </button>
            </div>
          ) : (
            cart.map(item => (
              <div className="cart-item" key={item._id}>
                <img src={item.image} alt={item.name} className="cart-item-img" />
                <div className="cart-item-info">
                  <span className="cart-item-name">{item.name}</span>
                  <span className="cart-item-price">{formatPrice(item.price)}</span>
                  <div className="cart-item-qty">
                    <button className="cart-item-qty-btn" onClick={() => updateQuantity(item._id, item.quantity - 1)}>
                      <Minus size={12} />
                    </button>
                    <span>{item.quantity}</span>
                    <button className="cart-item-qty-btn" onClick={() => updateQuantity(item._id, item.quantity + 1)}>
                      <Plus size={12} />
                    </button>
                  </div>
                  <button className="cart-item-remove" onClick={() => removeFromCart(item._id)}>Remove</button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Cart Drawer Checkout summary */}
        {cart.length > 0 && (
          <div className="cart-footer">
            <div className="cart-subtotal">
              <span>Subtotal:</span>
              <span style={{ color: '#6B1D2F' }}>{formatPrice(cartSubtotal)}</span>
            </div>
            <p style={{ fontSize: '11px', color: '#767676', marginBottom: '15px', fontStyle: 'italic' }}>
              Shipping and discounts calculated at checkout.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button 
                className="btn btn-primary" 
                style={{ width: '100%' }}
                onClick={() => { setIsCartOpen(false); navigate('/checkout'); }}
              >
                Proceed to Checkout
              </button>
              <button 
                className="btn btn-outline" 
                style={{ width: '100%', padding: '10px 0', fontSize: '12px' }}
                onClick={() => { setIsCartOpen(false); navigate('/shop'); }}
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Navbar;
