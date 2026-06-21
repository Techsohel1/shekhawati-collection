import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCurrency } from '../context/CurrencyContext';
import { useApp } from '../context/AppState';
import { API_URL } from '../config';
import { 
  LayoutDashboard, 
  Truck, 
  Layers, 
  Users2, 
  Ticket, 
  LogOut, 
  Store, 
  Bell, 
  User, 
  ChevronRight,
  Database
} from 'lucide-react';

// Subcomponents imports
import Overview from './Overview';
import Orders from './Orders';
import Products from './Products';
import Customers from './Customers';
import Coupons from './Coupons';

const AdminLayout = () => {
  const { formatPrice } = useCurrency();
  const { user, handleLogout, showAlert } = useApp();
  const navigate = useNavigate();

  // Active view tab state
  const [adminTab, setAdminTab] = useState('stats');
  
  // Stats overview data
  const [stats, setStats] = useState({
    sales: 0,
    ordersCount: 0,
    customersCount: 0,
    productsCount: 0
  });

  // DB datasets
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [usersList, setUsersList] = useState([]);

  // Form states for creating products
  const [newProdName, setNewProdName] = useState('');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdCategory, setNewProdCategory] = useState('Wooden Items');
  const [newProdStock, setNewProdStock] = useState('10');
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdImage, setNewProdImage] = useState('');
  const [newProdSpecs, setNewProdSpecs] = useState('{\n  "Material": "Premium Wood",\n  "Origin": "Shekhawati, Rajasthan",\n  "Craftsmanship": "Hand-Carved"\n}');
  const [submittingProduct, setSubmittingProduct] = useState(false);

  // Notifications dropdown trigger
  const [showNotifications, setShowNotifications] = useState(false);
  const [mockNotifications, setMockNotifications] = useState([
    { id: 1, text: "New luxury order #SH-9831 created by buyer", time: "5 mins ago", read: false },
    { id: 2, text: "Wooden Jewelry Chest item stock running low", time: "2 hrs ago", read: false },
    { id: 3, text: "Customer shekhawat_user1 signed up today", time: "4 hrs ago", read: true }
  ]);

  // Load dashboard metrics
  useEffect(() => {
    fetchDashboardData();
  }, [adminTab]);

  const fetchDashboardData = async () => {
    try {
      const headers = { 'Authorization': `Bearer ${localStorage.getItem('sc_token') || ''}` };

      // 1. Fetch Orders
      const orderRes = await fetch(`${API_URL}/api/orders`, { headers });
      const orderData = await orderRes.json();
      if (Array.isArray(orderData)) {
        setOrders(orderData);
      }

      // 2. Fetch Products
      const prodRes = await fetch(`${API_URL}/api/products`);
      const prodData = await prodRes.json();
      if (Array.isArray(prodData)) {
        setProducts(prodData);
      }

      // 3. Fetch Coupons
      setCoupons([
        { code: 'WELCOME10', discountType: 'percentage', discountValue: 10, minPurchase: 0, isActive: true },
        { code: 'ROYALGOLD', discountType: 'flat', discountValue: 50, minPurchase: 250, isActive: true },
        { code: 'FREESHIP', discountType: 'flat', discountValue: 15, minPurchase: 100, isActive: true }
      ]);

      // 4. Fetch Users (Admin only)
      const usersRes = await fetch(`${API_URL}/api/auth/users`, { headers });
      let usersData = [];
      if (usersRes.ok) {
        usersData = await usersRes.json();
        setUsersList(usersData);
      }

      // Calculate stats
      const totalSales = Array.isArray(orderData) ? orderData.reduce((sum, o) => sum + o.totalAmount, 0) : 0;
      
      const uniqueEmails = new Set();
      if (Array.isArray(orderData)) {
        orderData.forEach(o => {
          if (o.guestDetails) uniqueEmails.add(o.guestDetails.email);
        });
      }
      const actualCustomerCount = usersData.filter(u => u.role === 'customer').length;
      const totalCustomerCount = Math.max(actualCustomerCount, uniqueEmails.size);

      setStats({
        sales: totalSales,
        ordersCount: Array.isArray(orderData) ? orderData.length : 0,
        customersCount: totalCustomerCount || 1,
        productsCount: Array.isArray(prodData) ? prodData.length : 0
      });

    } catch (err) {
      console.log('Error loading admin console datasets:', err);
    }
  };

  // Change Shipping Status PUT call
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await fetch(`${API_URL}/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('sc_token') || ''}`
        },
        body: JSON.stringify({ shippingStatus: newStatus })
      });
      const data = await res.json();
      
      if (res.ok) {
        showAlert(`Order status updated to "${newStatus}"!`, 'success');
        setOrders(prev => prev.map(o => o._id === orderId ? { ...o, shippingStatus: newStatus } : o));
      } else {
        showAlert(data.message || 'Error updating status.', 'error');
      }
    } catch (err) {
      showAlert('Could not contact update server.', 'error');
    }
  };

  // Create Product POST call
  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!newProdName || !newProdPrice || !newProdDesc) {
      showAlert('Please enter core fields.', 'error');
      return;
    }

    setSubmittingProduct(true);
    try {
      let parsedSpecs = {};
      try {
        parsedSpecs = JSON.parse(newProdSpecs);
      } catch (err) {
        showAlert('Specifications must be valid JSON format.', 'error');
        setSubmittingProduct(false);
        return;
      }

      const res = await fetch(`${API_URL}/api/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('sc_token') || ''}`
        },
        body: JSON.stringify({
          name: newProdName,
          price: parseFloat(newProdPrice),
          category: newProdCategory,
          stock: parseInt(newProdStock),
          description: newProdDesc,
          images: [newProdImage || 'https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=800'],
          specifications: parsedSpecs,
          tags: [newProdCategory.toLowerCase().replace(' ', '-'), 'admin-added']
        })
      });

      const data = await res.json();
      if (res.ok) {
        showAlert('New product uploaded successfully!', 'success');
        setProducts(prev => [data, ...prev]);
        setNewProdName('');
        setNewProdPrice('');
        setNewProdDesc('');
        setNewProdImage('');
      } else {
        showAlert(data.message || 'Error creating product.', 'error');
      }
    } catch (err) {
      showAlert('Error uploading product details.', 'error');
    } finally {
      setSubmittingProduct(false);
    }
  };

  // Delete Product DELETE call
  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product from the database?')) return;

    try {
      const res = await fetch(`${API_URL}/api/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('sc_token') || ''}`
        }
      });
      if (res.ok) {
        showAlert('Product deleted from database.', 'info');
        setProducts(prev => prev.filter(p => p._id !== productId));
      } else {
        showAlert('Could not delete product.', 'error');
      }
    } catch (err) {
      showAlert('Connection error.', 'error');
    }
  };

  // Logout action helper
  const triggerLogout = () => {
    handleLogout();
    navigate('/profile');
    showAlert('Logged out from administrative session.', 'info');
  };

  // Sidebar items listing
  const sidebarItems = [
    { id: 'stats', label: 'Overview Metrics', icon: <LayoutDashboard size={18} /> },
    { id: 'orders', label: 'Manage Orders', icon: <Truck size={18} />, count: orders.length },
    { id: 'products', label: 'Manage Products', icon: <Layers size={18} />, count: products.length },
    { id: 'customers', label: 'Customers Directory', icon: <Users2 size={18} />, count: usersList.length },
    { id: 'coupons', label: 'Promo Coupons', icon: <Ticket size={18} /> }
  ];

  const getBreadcrumbs = () => {
    switch (adminTab) {
      case 'stats': return 'Overview Metrics';
      case 'orders': return 'Manage Orders';
      case 'products': return 'Manage Products';
      case 'customers': return 'Customers Directory';
      case 'coupons': return 'Promo Coupons';
      default: return 'Dashboard';
    }
  };

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      width: '100vw',
      overflow: 'hidden',
      position: 'fixed',
      top: 0,
      left: 0,
      backgroundColor: '#FAF8F3',
      zIndex: 9999,
      fontFamily: 'var(--font-sans)'
    }}>
      
      {/* 1. LEFT SIDEBAR PANEL */}
      <div style={{
        width: '280px',
        backgroundColor: '#4A101D', // Deep Royal Burgundy
        borderRight: '1px solid #D4AF37', // Luxury Gold border
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '24px 16px',
        flexShrink: 0,
        boxShadow: '4px 0 25px rgba(0,0,0,0.15)',
        zIndex: 100
      }}>
        <div>
          {/* Header Title */}
          <div style={{ 
            borderBottom: '1px solid rgba(212,175,55,0.2)', 
            paddingBottom: '20px', 
            marginBottom: '24px', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px',
            justifyContent: 'center' 
          }}>
            <img 
              src="/logo.jpg" 
              alt="Shekhawati Logo" 
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '1.5px solid #D4AF37'
              }}
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <div>
              <span style={{ 
                color: '#D4AF37', 
                fontSize: '9px', 
                letterSpacing: '2.5px', 
                textTransform: 'uppercase', 
                fontWeight: 700, 
                display: 'block' 
              }}>
                ADMINISTRATION
              </span>
              <h3 style={{ 
                fontSize: '17px', 
                color: '#FFF', 
                fontFamily: 'var(--font-serif)', 
                marginTop: '2px', 
                letterSpacing: '0.5px' 
              }}>
                Shekhawati Board
              </h3>
            </div>
          </div>

          {/* Profile User block */}
          {user && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              backgroundColor: 'rgba(252,251,247,0.04)',
              border: '1px solid rgba(212,175,55,0.15)',
              padding: '12px',
              borderRadius: '6px',
              marginBottom: '24px'
            }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: '#D4AF37',
                color: '#4A101D',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '13px'
              }}>
                {user.name ? user.name.slice(0,2).toUpperCase() : 'AD'}
              </div>
              <div style={{ overflow: 'hidden' }}>
                <span style={{ color: '#FFF', fontSize: '13px', fontWeight: 600, display: 'block', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                  {user.name || 'Store Admin'}
                </span>
                <span style={{ color: '#D4AF37', fontSize: '10px', textTransform: 'uppercase', fontWeight: 600, display: 'block', marginTop: '2px' }}>
                  👑 Principal Admin
                </span>
              </div>
            </div>
          )}

          {/* Navigation Links */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {sidebarItems.map(item => (
              <button
                key={item.id}
                onClick={() => setAdminTab(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  padding: '12px 16px',
                  backgroundColor: adminTab === item.id ? 'rgba(212,175,55,0.1)' : 'transparent',
                  border: 'none',
                  borderRadius: '4px',
                  color: adminTab === item.id ? '#D4AF37' : 'rgba(252,251,247,0.7)',
                  cursor: 'pointer',
                  fontSize: '13.5px',
                  fontWeight: adminTab === item.id ? 600 : 500,
                  transition: 'all 0.3s ease',
                  textAlign: 'left',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  if (adminTab !== item.id) {
                    e.currentTarget.style.color = '#FFF';
                    e.currentTarget.style.backgroundColor = 'rgba(252,251,247,0.03)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (adminTab !== item.id) {
                    e.currentTarget.style.color = 'rgba(252,251,247,0.7)';
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ 
                    color: adminTab === item.id ? '#D4AF37' : 'inherit',
                    display: 'flex',
                    alignItems: 'center' 
                  }}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>

                {item.count !== undefined && (
                  <span style={{
                    backgroundColor: adminTab === item.id ? '#D4AF37' : 'rgba(252,251,247,0.15)',
                    color: adminTab === item.id ? '#4A101D' : '#FFF',
                    fontSize: '10.5px',
                    fontWeight: 700,
                    padding: '2px 7px',
                    borderRadius: '10px',
                    transition: 'all 0.3s'
                  }}>
                    {item.count}
                  </span>
                )}

                {/* Left Active highlight border bar */}
                {adminTab === item.id && (
                  <div style={{
                    position: 'absolute',
                    left: 0,
                    top: '8px',
                    bottom: '8px',
                    width: '3.5px',
                    backgroundColor: '#D4AF37',
                    borderRadius: '0 4px 4px 0'
                  }}></div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Footer controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          
          {/* Back to Client Storefront */}
          <button
            onClick={() => navigate('/')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              width: '100%',
              padding: '10px 14px',
              backgroundColor: 'rgba(252,251,247,0.03)',
              border: '1px solid rgba(252,251,247,0.15)',
              borderRadius: '4px',
              color: '#FFF',
              cursor: 'pointer',
              fontSize: '12px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              fontWeight: 600,
              justifyContent: 'center',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#D4AF37';
              e.currentTarget.style.color = '#4A101D';
              e.currentTarget.style.borderColor = '#D4AF37';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(252,251,247,0.03)';
              e.currentTarget.style.color = '#FFF';
              e.currentTarget.style.borderColor = 'rgba(252,251,247,0.15)';
            }}
          >
            <Store size={14} /> Back to Shop
          </button>

          {/* Logout */}
          <button
            onClick={triggerLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              width: '100%',
              padding: '10px 14px',
              backgroundColor: 'transparent',
              border: 'none',
              borderRadius: '4px',
              color: '#FCA5A5',
              cursor: 'pointer',
              fontSize: '12px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              fontWeight: 600,
              justifyContent: 'center',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <LogOut size={14} /> Exit Session
          </button>

          {/* Connection profile status */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '9.5px',
            color: 'rgba(252,251,247,0.4)',
            justifyContent: 'center',
            borderTop: '1px solid rgba(212,175,55,0.1)',
            paddingTop: '12px',
            marginTop: '8px'
          }}>
            <Database size={9} style={{ color: '#10B981' }} />
            <span>MongoDB Connected Securely</span>
          </div>

        </div>

      </div>

      {/* 2. RIGHT MAIN INTERACTIVE DASHBOARD CONTAINER */}
      <div style={{
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        overflow: 'hidden'
      }}>
        
        {/* Top Header bar */}
        <div style={{
          height: '70px',
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid #E5D5B3', // Gold line divider
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 32px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.02)',
          flexShrink: 0,
          zIndex: 10
        }}>
          {/* Breadcrumbs / Page Title */}
          <div>
            <span style={{ fontSize: '11px', color: '#767676', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Portal Console / Admin
            </span>
            <h3 style={{ fontSize: '18px', color: '#6B1D2F', fontWeight: 600, marginTop: '2px', fontFamily: 'var(--font-serif)' }}>
              {getBreadcrumbs()}
            </h3>
          </div>

          {/* Right Side Widgets (Search / Notification bell / profile shortcut) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', position: 'relative' }}>
            
            {/* Notification Bell */}
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              style={{
                background: 'none',
                border: 'none',
                color: '#6B1D2F',
                cursor: 'pointer',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '6px',
                borderRadius: '50%',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FAF8F3'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <Bell size={20} />
              {mockNotifications.some(n => !n.read) && (
                <span style={{
                  position: 'absolute',
                  top: '2px',
                  right: '2px',
                  width: '9px',
                  height: '9px',
                  backgroundColor: '#D4AF37',
                  border: '2px solid #FFFFFF',
                  borderRadius: '50%'
                }}></span>
              )}
            </button>

            {/* Notification Dropdown Panel */}
            {showNotifications && (
              <>
                {/* Backdrop Click Shield */}
                <div 
                  onClick={() => setShowNotifications(false)}
                  style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 998 }}
                />
                
                <div style={{
                  position: 'absolute',
                  top: '40px',
                  right: 0,
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E5D5B3',
                  borderRadius: '6px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                  width: '320px',
                  zIndex: 999,
                  overflow: 'hidden',
                  animation: 'slideDown 0.2s ease'
                }}>
                  <div style={{
                    backgroundColor: '#FAF8F3',
                    borderBottom: '1px solid #E5D5B3',
                    padding: '12px 16px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <strong style={{ fontSize: '13px', color: '#6B1D2F' }}>Notifications</strong>
                    <button 
                      onClick={() => {
                        setMockNotifications(prev => prev.map(n => ({ ...n, read: true })));
                        showAlert('All notifications marked as read', 'info');
                      }}
                      style={{ background: 'none', border: 'none', color: '#D4AF37', fontSize: '11px', cursor: 'pointer', fontWeight: 600 }}
                    >
                      Mark all read
                    </button>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', maxHeight: '250px', overflowY: 'auto' }}>
                    {mockNotifications.map(notif => (
                      <div 
                        key={notif.id}
                        style={{
                          padding: '12px 16px',
                          borderBottom: '1px solid #FAF8F3',
                          fontSize: '12px',
                          backgroundColor: notif.read ? '#FFFFFF' : '#FAF8F3' + '80',
                          lineHeight: 1.4
                        }}
                      >
                        <p style={{ color: '#1C1C1C', fontWeight: notif.read ? 400 : 600 }}>{notif.text}</p>
                        <span style={{ fontSize: '10px', color: '#9A9A9A', display: 'block', marginTop: '4px' }}>{notif.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Admin Avatar visual */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              borderLeft: '1px solid #FAF8F3',
              paddingLeft: '15px'
            }}>
              <span style={{ fontSize: '12px', color: '#767676', fontWeight: 500 }}>Global Admin</span>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: '#FAF8F3',
                border: '1.5px solid #E5D5B3',
                color: '#6B1D2F',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: '12px'
              }}>
                👑
              </div>
            </div>

          </div>
        </div>

        {/* Scrollable Content Body */}
        <div style={{
          flexGrow: 1,
          overflowY: 'auto',
          padding: '32px',
          backgroundColor: '#FAF8F3'
        }}>
          {adminTab === 'stats' && (
            <Overview 
              stats={stats} 
              formatPrice={formatPrice} 
              setTab={setAdminTab} 
            />
          )}

          {adminTab === 'orders' && (
            <Orders 
              orders={orders} 
              formatPrice={formatPrice} 
              handleStatusChange={handleStatusChange} 
            />
          )}

          {adminTab === 'products' && (
            <Products 
              products={products}
              formatPrice={formatPrice}
              handleDeleteProduct={handleDeleteProduct}
              handleAddProduct={handleAddProduct}
              newProdName={newProdName} setNewProdName={setNewProdName}
              newProdPrice={newProdPrice} setNewProdPrice={setNewProdPrice}
              newProdCategory={newProdCategory} setNewProdCategory={setNewProdCategory}
              newProdStock={newProdStock} setNewProdStock={setNewProdStock}
              newProdDesc={newProdDesc} setNewProdDesc={setNewProdDesc}
              newProdImage={newProdImage} setNewProdImage={setNewProdImage}
              newProdSpecs={newProdSpecs} setNewProdSpecs={setNewProdSpecs}
              submittingProduct={submittingProduct}
            />
          )}

          {adminTab === 'customers' && (
            <Customers 
              usersList={usersList} 
            />
          )}

          {adminTab === 'coupons' && (
            <Coupons 
              coupons={coupons} 
              formatPrice={formatPrice}
              showAlert={showAlert}
            />
          )}
        </div>

      </div>

      <style>{`
        /* Scrollbar styles inside administrative views */
        ::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        ::-webkit-scrollbar-track {
          background: #FAF8F3;
        }
        ::-webkit-scrollbar-thumb {
          background: #E5D5B3;
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #D4AF37;
        }
        
        @keyframes slideDown {
          from { transform: translateY(-5px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>

    </div>
  );
};

export default AdminLayout;
