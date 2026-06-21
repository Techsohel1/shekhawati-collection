import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppState';
import { CurrencyProvider } from './context/CurrencyContext';

// Core Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LiveChat from './components/LiveChat';
import ComparisonDrawer from './components/ComparisonDrawer';

// Page Views
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import TrackOrder from './pages/TrackOrder';
import Profile from './pages/Profile';
import Blog from './pages/Blog';
import AdminLayout from './admin/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Static Info Pages
import { 
  AboutUs, 
  ContactUs, 
  FAQ, 
  PrivacyPolicy, 
  ReturnRefundPolicy, 
  ShippingPolicy, 
  TermsConditions 
} from './pages/StaticPages';

// Scroll to Top on Page navigation helper
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Global Floating Notification Toast Alerts Component
const ToastAlert = () => {
  const { alert } = useApp();
  if (!alert) return null;

  const bgColors = {
    success: '#10B981',
    error: '#EF4444',
    info: '#3B82F6'
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '100px',
      left: '30px',
      zIndex: 9999,
      backgroundColor: bgColors[alert.type] || '#1C1C1C',
      color: '#FFFFFF',
      padding: '12px 24px',
      borderRadius: '4px',
      fontSize: '13px',
      fontWeight: 500,
      letterSpacing: '0.5px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      animation: 'fadeInUp 0.3s ease'
    }}>
      <span>🔔</span>
      <span>{alert.message}</span>
    </div>
  );
};

const AppContent = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <>
      <ScrollToTop />
      
      {/* Header Navigation Navigation */}
      {!isAdmin && <Navbar />}

      {/* Pages Container */}
      <div style={isAdmin ? {} : { minHeight: '70vh' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/track-order" element={<TrackOrder />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/admin" element={
            <ProtectedRoute adminOnly={true}>
              <AdminLayout />
            </ProtectedRoute>
          } />
          
          {/* Information & Policies */}
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/refund-policy" element={<ReturnRefundPolicy />} />
          <Route path="/shipping-policy" element={<ShippingPolicy />} />
          <Route path="/terms-conditions" element={<TermsConditions />} />
        </Routes>
      </div>

      {/* Floating Utilities */}
      {!isAdmin && <LiveChat />}
      {!isAdmin && <ComparisonDrawer />}
      <ToastAlert />

      {/* Footer Branding Area */}
      {!isAdmin && <Footer />}
    </>
  );
};

function App() {
  return (
    <AppProvider>
      <CurrencyProvider>
        <Router>
          <AppContent />
        </Router>
      </CurrencyProvider>
    </AppProvider>
  );
}

export default App;
