import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppState';
import { useCurrency } from '../context/CurrencyContext';
import ProductCard from '../components/ProductCard';
// AdminDashboard component removed in favor of modular src/admin/AdminLayout
import { KeyRound, Mail, User, ShieldAlert, Award, FileText, Heart, Calendar } from 'lucide-react';
import { API_URL } from '../config';

const Profile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, login, signup, wishlist, showAlert } = useApp();
  const { formatPrice } = useCurrency();

  // Tab control states
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoginView, setIsLoginView] = useState(true);
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Form field states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  
  const [submittingAuth, setSubmittingAuth] = useState(false);

  // Auto switch tab if directed via URL parameters (e.g. ?tab=wishlist or ?tab=admin)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get('tab');
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [location.search]);

  // Load orders history if user logged in
  useEffect(() => {
    if (user && activeTab === 'orders') {
      fetchUserOrders();
    }
  }, [user, activeTab]);

  const fetchUserOrders = async () => {
    setLoadingOrders(true);
    try {
      const res = await fetch(`${API_URL}/api/orders`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('sc_token') || ''}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (err) {
      console.log('Error loading orders:', err);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) return;

    setSubmittingAuth(true);
    const result = await login(loginEmail, loginPassword);
    setSubmittingAuth(false);
    if (result.success) {
      setLoginEmail('');
      setLoginPassword('');
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    if (!signupName || !signupEmail || !signupPassword) return;

    setSubmittingAuth(true);
    const result = await signup(signupName, signupEmail, signupPassword);
    setSubmittingAuth(false);
    if (result.success) {
      setSignupName('');
      setSignupEmail('');
      setSignupPassword('');
    }
  };

  // Printable Invoice renderer
  const handlePrintInvoice = (order) => {
    const printWindow = window.open('', '_blank');
    const subtotal = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice - ${order.trackingNumber}</title>
          <style>
            body { font-family: 'Georgia', serif; padding: 40px; color: #1C1C1C; background-color: #FCFBF7; }
            .box { max-width: 800px; margin: auto; padding: 30px; border: 1px solid #E5D5B3; background-color: #FFF; }
            .header { border-bottom: 2px solid #6B1D2F; padding-bottom: 20px; display: flex; justify-content: space-between; }
            .logo { font-size: 24px; font-weight: bold; color: #6B1D2F; }
            .table { width: 100%; margin-top: 40px; border-collapse: collapse; }
            .table th { border-bottom: 2px solid #E5D5B3; padding: 10px; font-size: 13px; text-align: left; }
            .table td { border-bottom: 1px solid #F0EDE4; padding: 12px 10px; font-size: 14px; }
            .total { border-top: 2px solid #6B1D2F; font-size: 18px; font-weight: bold; color: #6B1D2F; margin-top: 20px; text-align: right; padding-top: 10px; }
          </style>
        </head>
        <body>
          <div class="box">
            <div class="header">
              <div class="logo">🏰 Shekhawati Collection Receipt</div>
              <div style="font-size: 13px; text-align: right;">
                Order ID: #${order._id}<br/>
                Tracking: ${order.trackingNumber}<br/>
                Date: ${new Date(order.createdAt).toLocaleDateString()}
              </div>
            </div>
            <div style="margin-top: 20px; font-size: 14px;">
              <strong>Shipping to:</strong><br/>
              ${order.shippingAddress.name}<br/>
              ${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zip}<br/>
              ${order.shippingAddress.country}
            </div>
            <table class="table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th style="text-align: right;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${order.items.map(item => `
                  <tr>
                    <td>${item.name}</td>
                    <td>$${item.price.toFixed(2)}</td>
                    <td>${item.quantity}</td>
                    <td style="text-align: right;">$${(item.price * item.quantity).toFixed(2)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
            <div class="total">
              Settled Total: $${order.totalAmount.toFixed(2)}
            </div>
          </div>
          <script>window.print();</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // IF USER IS NOT LOGGED IN
  if (!user) {
    return (
      <div className="container section-padding" style={{ maxWidth: '500px' }}>
        <div style={{
          backgroundColor: '#fff',
          border: '1px solid #E5D5B3',
          padding: '40px',
          boxShadow: 'var(--shadow-premium)'
        }}>
          {/* Header tabs login/signup */}
          <div style={{ display: 'flex', borderBottom: '1px solid #E5D5B3', marginBottom: '30px' }}>
            <button 
              style={{
                flexGrow: 1,
                background: 'none',
                border: 'none',
                padding: '12px 0',
                fontSize: '14px',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '1px',
                cursor: 'pointer',
                color: isLoginView ? '#6B1D2F' : '#767676',
                borderBottom: isLoginView ? '2px solid #6B1D2F' : 'none'
              }}
              onClick={() => setIsLoginView(true)}
            >
              Sign In
            </button>
            <button 
              style={{
                flexGrow: 1,
                background: 'none',
                border: 'none',
                padding: '12px 0',
                fontSize: '14px',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '1px',
                cursor: 'pointer',
                color: !isLoginView ? '#6B1D2F' : '#767676',
                borderBottom: !isLoginView ? '2px solid #6B1D2F' : 'none'
              }}
              onClick={() => setIsLoginView(false)}
            >
              Register
            </button>
          </div>

          {/* LOGIN FORM */}
          {isLoginView ? (
            <form onSubmit={handleLoginSubmit}>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #E5D5B3', padding: '10px 14px' }}>
                  <Mail size={16} style={{ color: '#767676', marginRight: '10px' }} />
                  <input 
                    type="email" 
                    className="form-control" 
                    style={{ border: 'none', padding: 0 }} 
                    required 
                    placeholder="buyer@domain.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #E5D5B3', padding: '10px 14px' }}>
                  <KeyRound size={16} style={{ color: '#767676', marginRight: '10px' }} />
                  <input 
                    type="password" 
                    className="form-control" 
                    style={{ border: 'none', padding: 0 }} 
                    required 
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px', marginTop: '10px' }} disabled={submittingAuth}>
                {submittingAuth ? 'Verifying Credentials...' : 'Sign In'}
              </button>
              
              <span style={{ display: 'block', fontSize: '11px', color: '#767676', marginTop: '12px', textAlign: 'center' }}>
                * Hint: Log in with shekhawaticollection@gmail.com / AdminPassword123 for Administrator portal.
              </span>
            </form>
          ) : (
            // REGISTRATION FORM
            <form onSubmit={handleSignupSubmit}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #E5D5B3', padding: '10px 14px' }}>
                  <User size={16} style={{ color: '#767676', marginRight: '10px' }} />
                  <input 
                    type="text" 
                    className="form-control" 
                    style={{ border: 'none', padding: 0 }} 
                    required 
                    placeholder="e.g. John Doe"
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #E5D5B3', padding: '10px 14px' }}>
                  <Mail size={16} style={{ color: '#767676', marginRight: '10px' }} />
                  <input 
                    type="email" 
                    className="form-control" 
                    style={{ border: 'none', padding: 0 }} 
                    required 
                    placeholder="buyer@domain.com"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #E5D5B3', padding: '10px 14px' }}>
                  <KeyRound size={16} style={{ color: '#767676', marginRight: '10px' }} />
                  <input 
                    type="password" 
                    className="form-control" 
                    style={{ border: 'none', padding: 0 }} 
                    required 
                    placeholder="Create security password..."
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px', marginTop: '10px' }} disabled={submittingAuth}>
                {submittingAuth ? 'Creating Account...' : 'Sign Up'}
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  // IF USER IS LOGGED IN
  return (
    <div className="container section-padding">
      <div className="section-header">
        <span className="subtitle">Member Suite</span>
        <h2>My Account</h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '40px', alignItems: 'flex-start' }}>
        {/* Left Navigation Sidebar */}
        <aside className="shop-sidebar" style={{ padding: '20px' }}>
          <ul className="filter-list">
            <li>
              <div className={`filter-link ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>
                👑 Client Profile
              </div>
            </li>
            <li>
              <div className={`filter-link ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>
                📜 Order History ({orders.length})
              </div>
            </li>
            <li>
              <div className={`filter-link ${activeTab === 'wishlist' ? 'active' : ''}`} onClick={() => setActiveTab('wishlist')}>
                ❤️ My Wishlist ({wishlist.length})
              </div>
            </li>
            {user.role === 'admin' && (
              <li>
                <div 
                  className="filter-link" 
                  onClick={() => navigate('/admin')}
                  style={{ color: '#D4AF37', fontWeight: 600 }}
                >
                  🏰 Admin Console
                </div>
              </li>
            )}
          </ul>
        </aside>

        {/* Right Tab Content */}
        <main style={{ backgroundColor: '#fff', border: '1px solid #E5D5B3', padding: '40px', boxShadow: 'var(--shadow-premium)' }}>
          
          {/* TAB 1: USER DETAILS */}
          {activeTab === 'profile' && (
            <div>
              <h3 style={{ color: '#6B1D2F', borderBottom: '1px solid #E5D5B3', paddingBottom: '15px', marginBottom: '25px', fontSize: '20px' }}>
                Client Details
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', fontSize: '15px' }}>
                <div>
                  <span style={{ color: '#767676', display: 'block', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Member Name</span>
                  <strong style={{ color: '#1C1C1C', fontSize: '16px' }}>{user.name}</strong>
                </div>
                <div>
                  <span style={{ color: '#767676', display: 'block', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Email Address</span>
                  <strong style={{ color: '#1C1C1C', fontSize: '16px' }}>{user.email}</strong>
                </div>
                <div>
                  <span style={{ color: '#767676', display: 'block', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Account Status</span>
                  <strong style={{ color: user.role === 'admin' ? '#D4AF37' : '#10B981', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    {user.role === 'admin' ? '⚜️ ROYAL ADMINISTRATOR' : '✓ Standard Customer'}
                  </strong>
                </div>
                
                {/* Loyalty points card */}
                <div style={{
                  backgroundColor: '#F9F5EA',
                  border: '1px solid #E5D5B3',
                  padding: '25px',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '20px',
                  marginTop: '15px'
                }}>
                  <div style={{
                    backgroundColor: '#6B1D2F',
                    color: '#FFF',
                    padding: '12px',
                    borderRadius: '4px'
                  }}>
                    <Award size={32} />
                  </div>
                  <div>
                    <span style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', color: '#767676', display: 'block', marginBottom: '4px' }}>
                      Loyalty Reward Balance
                    </span>
                    <h4 style={{ fontSize: '28px', color: '#6B1D2F', fontWeight: 'bold' }}>{user.rewardPoints || 0} Points</h4>
                    <p style={{ fontSize: '11px', color: '#767676', marginTop: '2px' }}>
                      Worth <strong style={{ color: '#1C1C1C' }}>{formatPrice((user.rewardPoints || 0) * 0.1)}</strong> discount on future checkout baskets.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ORDER HISTORY */}
          {activeTab === 'orders' && (
            <div>
              <h3 style={{ color: '#6B1D2F', borderBottom: '1px solid #E5D5B3', paddingBottom: '15px', marginBottom: '25px', fontSize: '20px' }}>
                Order Logs
              </h3>

              {loadingOrders ? (
                <p>Loading transaction files...</p>
              ) : orders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                  <Calendar size={40} style={{ color: '#E5D5B3', marginBottom: '15px' }} />
                  <p style={{ color: '#767676' }}>No orders placed under this account yet.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {orders.map(order => (
                    <div 
                      key={order._id}
                      style={{
                        border: '1px solid #E5D5B3',
                        backgroundColor: '#FCFBF7',
                        padding: '20px',
                        display: 'grid',
                        gridTemplateColumns: '1.2fr 1fr 1fr 0.8fr',
                        alignItems: 'center',
                        fontSize: '13px'
                      }}
                    >
                      <div>
                        <span style={{ color: '#767676', display: 'block', fontSize: '10px', textTransform: 'uppercase' }}>Tracking Code</span>
                        <strong style={{ color: '#6B1D2F', fontSize: '14px' }}>{order.trackingNumber}</strong>
                        <span style={{ display: 'block', color: '#767676', marginTop: '4px', fontSize: '11px' }}>
                          Placed on: {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div>
                        <span style={{ color: '#767676', display: 'block', fontSize: '10px', textTransform: 'uppercase' }}>Paid Amount</span>
                        <strong>{formatPrice(order.totalAmount)}</strong>
                        <span style={{ display: 'block', color: '#767676', fontSize: '11px' }}>
                          Method: {order.paymentMethod}
                        </span>
                      </div>
                      <div>
                        <span style={{ color: '#767676', display: 'block', fontSize: '10px', textTransform: 'uppercase' }}>Delivery Status</span>
                        <span style={{
                          color: order.shippingStatus === 'Delivered' ? '#10B981' : '#D4AF37',
                          fontWeight: 600
                        }}>
                          {order.shippingStatus}
                        </span>
                      </div>
                      <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <button className="btn btn-outline btn-sm" onClick={() => handlePrintInvoice(order)} style={{ padding: '6px 12px', fontSize: '10px' }}>
                          <FileText size={10} style={{ marginRight: '4px' }} /> Invoice
                        </button>
                        <button className="btn btn-primary btn-sm" onClick={() => navigate(`/track-order?search=${order.trackingNumber}`)} style={{ padding: '6px 12px', fontSize: '10px' }}>
                          Track
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: WISHLIST */}
          {activeTab === 'wishlist' && (
            <div>
              <h3 style={{ color: '#6B1D2F', borderBottom: '1px solid #E5D5B3', paddingBottom: '15px', marginBottom: '25px', fontSize: '20px' }}>
                My Wishlist
              </h3>

              {wishlist.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                  <Heart size={40} style={{ color: '#E5D5B3', marginBottom: '15px' }} />
                  <p style={{ color: '#767676' }}>Your wishlist is currently empty.</p>
                  <Link to="/shop" className="btn btn-primary btn-sm" style={{ marginTop: '15px' }}>Browse Products</Link>
                </div>
              ) : (
                <div className="products-grid">
                  {wishlist.map(product => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: ADMIN CONSOLE (Handled via navigate to /admin in sidebar) */}

        </main>
      </div>
    </div>
  );
};

export default Profile;
