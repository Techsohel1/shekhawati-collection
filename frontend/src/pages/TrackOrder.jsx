import React, { useState } from 'react';
import { useCurrency } from '../context/CurrencyContext';
import { Search, MapPin, Calendar, Box, CheckCircle2 } from 'lucide-react';
import { API_URL } from '../config';

const TrackOrder = () => {
  const { formatPrice } = useCurrency();
  const [trackingId, setTrackingId] = useState('');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrackSubmit = async (e) => {
    e.preventDefault();
    if (!trackingId.trim()) return;

    setLoading(true);
    setError('');
    setOrder(null);
    
    try {
      const res = await fetch(`${API_URL}/api/orders/${trackingId.trim().toUpperCase()}`);
      const data = await res.json();

      if (res.ok) {
        setOrder(data);
      } else {
        setError(data.message || 'Tracking ID not found. Try searching e.g. SC-TRACK-xxxxxx.');
      }
    } catch (err) {
      setError('Could not connect to tracking server. Please check your network.');
    } finally {
      setLoading(false);
    }
  };

  const validStatusList = ['Ordered', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered'];

  // Helper to determine active/complete progress items
  const getStepClass = (stepName) => {
    if (!order) return '';
    const currentIndex = validStatusList.indexOf(order.shippingStatus);
    const stepIndex = validStatusList.indexOf(stepName);

    if (stepIndex < currentIndex) return 'complete';
    if (stepIndex === currentIndex) return 'active';
    return '';
  };

  return (
    <div className="container section-padding" style={{ maxWidth: '900px' }}>
      <div className="section-header">
        <span className="subtitle">Realtime Tracker</span>
        <h2>Track Your Order</h2>
      </div>

      {/* Tracking search input form */}
      <div style={{
        backgroundColor: '#fff',
        border: '1px solid #E5D5B3',
        padding: '30px',
        boxShadow: 'var(--shadow-premium)',
        marginBottom: '40px'
      }}>
        <form onSubmit={handleTrackSubmit} style={{ display: 'flex', gap: '15px' }}>
          <div style={{
            flexGrow: 1,
            display: 'flex',
            alignItems: 'center',
            border: '1px solid #E5D5B3',
            padding: '10px 14px',
            backgroundColor: '#fff'
          }}>
            <Search size={18} style={{ color: '#767676', marginRight: '10px' }} />
            <input
              type="text"
              placeholder="Enter your Order Tracking Number (e.g. SC-TRACK-123456)"
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value)}
              required
              style={{
                border: 'none',
                outline: 'none',
                fontSize: '14px',
                width: '100%'
              }}
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading} style={{ padding: '0 30px' }}>
            {loading ? 'Searching...' : 'Track'}
          </button>
        </form>
        <span style={{ display: 'block', fontSize: '11px', color: '#767676', marginTop: '8px' }}>
          * Tracking codes are found on order confirmation receipts.
        </span>

        {error && (
          <div style={{
            backgroundColor: '#FEF2F2',
            border: '1px solid #FCA5A5',
            color: '#B91C1C',
            padding: '12px 15px',
            marginTop: '20px',
            fontSize: '13px'
          }}>
            ⚠️ {error}
          </div>
        )}
      </div>

      {/* Tracking details presentation */}
      {order && (
        <div className="track-card">
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            borderBottom: '1px solid #E5D5B3',
            paddingBottom: '20px',
            marginBottom: '30px'
          }}>
            <div>
              <span style={{ fontSize: '12px', color: '#767676', textTransform: 'uppercase', letterSpacing: '1px' }}>Order Tracking</span>
              <h3 style={{ fontSize: '22px', color: '#6B1D2F', marginTop: '4px' }}>{order.trackingNumber}</h3>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '12px', color: '#767676', textTransform: 'uppercase', letterSpacing: '1px' }}>Status</span>
              <h4 style={{ fontSize: '16px', color: '#6B1D2F', fontWeight: 600, marginTop: '4px' }}>{order.shippingStatus}</h4>
            </div>
          </div>

          {/* Progress gauge visual bars */}
          <div className="track-progress">
            {validStatusList.map((step, idx) => (
              <div className={`track-step ${getStepClass(step)}`} key={idx}>
                <div className="track-circle">
                  {validStatusList.indexOf(order.shippingStatus) > idx ? '✓' : idx + 1}
                </div>
                <span className="track-label">{step}</span>
              </div>
            ))}
          </div>

          {/* Delivery Details */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1.2fr 0.8fr',
            gap: '40px',
            marginTop: '60px',
            borderTop: '1px solid #F0EDE4',
            paddingTop: '40px'
          }}>
            {/* Info details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', fontSize: '14px' }}>
              <div style={{ display: 'flex', gap: '15px' }}>
                <MapPin size={20} style={{ color: '#D4AF37', flexShrink: 0 }} />
                <div>
                  <strong style={{ display: 'block', color: '#1C1C1C', textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.5px', marginBottom: '4px' }}>
                    Shipping Destination
                  </strong>
                  <span>{order.shippingAddress.name}</span>
                  <span style={{ display: 'block', color: '#767676', marginTop: '2px' }}>
                    {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}, {order.shippingAddress.country}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '15px' }}>
                <Calendar size={20} style={{ color: '#D4AF37', flexShrink: 0 }} />
                <div>
                  <strong style={{ display: 'block', color: '#1C1C1C', textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.5px', marginBottom: '4px' }}>
                    Estimated Delivery
                  </strong>
                  <span style={{ color: '#6B1D2F', fontWeight: 600 }}>{order.estimatedDelivery}</span>
                  <span style={{ display: 'block', color: '#767676', marginTop: '2px' }}>
                    Worldwide Priority Mail Carrier (Trackable)
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '15px' }}>
                <Box size={20} style={{ color: '#D4AF37', flexShrink: 0 }} />
                <div>
                  <strong style={{ display: 'block', color: '#1C1C1C', textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.5px', marginBottom: '4px' }}>
                    Carrier Info & Tracking Code
                  </strong>
                  <span>Shekhawati Royal Logistics Depot</span>
                  <span style={{ display: 'block', color: '#767676', marginTop: '2px' }}>
                    Order ID: #{order._id}
                  </span>
                </div>
              </div>
            </div>

            {/* Items summary */}
            <div style={{
              backgroundColor: '#FCFBF7',
              border: '1px solid #E5D5B3',
              padding: '25px',
              borderRadius: '2px'
            }}>
              <h4 style={{ color: '#6B1D2F', fontSize: '15px', borderBottom: '1px solid #E5D5B3', paddingBottom: '10px', marginBottom: '15px' }}>
                Items Summary
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
                {order.items.map(item => (
                  <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
                    <span style={{ color: '#767676' }}>
                      {item.name} <strong style={{ color: '#1C1C1C' }}>x {item.quantity}</strong>
                    </span>
                    <span style={{ fontWeight: 500 }}>{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
                
                <div style={{
                  borderTop: '1px solid #E5D5B3',
                  paddingTop: '10px',
                  marginTop: '10px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontWeight: 600,
                  fontSize: '14px'
                }}>
                  <span>Paid Total:</span>
                  <span style={{ color: '#6B1D2F' }}>{formatPrice(order.totalAmount)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrackOrder;
