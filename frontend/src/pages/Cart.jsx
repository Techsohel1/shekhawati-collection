import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppState';
import { useCurrency } from '../context/CurrencyContext';
import { ShoppingBag, Trash2, Plus, Minus, Tag, Truck } from 'lucide-react';
import { API_URL } from '../config';

const Cart = () => {
  const navigate = useNavigate();
  const { cart, updateQuantity, removeFromCart, showAlert } = useApp();
  const { formatPrice } = useCurrency();

  // Coupon promo states
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [checkingCoupon, setCheckingCoupon] = useState(false);

  const cartSubtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  // Free shipping above $150, else $15 USD worldwide shipping
  const shippingCost = cartSubtotal >= 150 || cartSubtotal === 0 ? 0 : 15;

  // Coupon validation logic
  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode) return;

    setCheckingCoupon(true);
    try {
      const res = await fetch(`${API_URL}/api/utils/coupons/${couponCode.toUpperCase()}`);
      const data = await res.json();

      if (res.ok) {
        // Validate minimum purchase
        if (cartSubtotal >= data.minPurchase) {
          setAppliedCoupon(data);
          showAlert(`Coupon "${data.code}" applied successfully!`, 'success');
        } else {
          showAlert(`Coupon "${data.code}" requires a minimum purchase of ${formatPrice(data.minPurchase)}.`, 'error');
        }
      } else {
        showAlert(data.message || 'Invalid coupon code.', 'error');
      }
    } catch (err) {
      showAlert('Error validating coupon code.', 'error');
    } finally {
      setCheckingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    showAlert('Coupon code removed.', 'info');
  };

  // Calculate discount value
  const calculateDiscount = () => {
    if (!appliedCoupon) return 0;
    if (appliedCoupon.discountType === 'percentage') {
      return parseFloat(((cartSubtotal * appliedCoupon.discountValue) / 100).toFixed(2));
    }
    return appliedCoupon.discountValue;
  };

  const discountAmount = calculateDiscount();
  const cartTotal = cartSubtotal + shippingCost - discountAmount;

  if (cart.length === 0) {
    return (
      <div className="container section-padding" style={{ textAlign: 'center', minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <ShoppingBag size={64} style={{ color: '#E5D5B3', marginBottom: '20px' }} />
        <h2>Your Luxury Cart is Empty</h2>
        <p style={{ color: '#767676', marginTop: '10px', marginBottom: '30px' }}>Fill it with premium Rajasthani woodwork, Kundan jewels, or elegant handloom suits.</p>
        <Link to="/shop" className="btn btn-primary">Go to Shop</Link>
      </div>
    );
  }

  return (
    <div className="container section-padding">
      <div className="section-header">
        <span className="subtitle">Selected Items</span>
        <h2>Your Shopping Bag</h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.2fr', gap: '40px', alignItems: 'flex-start' }}>
        {/* Left Side: Cart Items List */}
        <div style={{ backgroundColor: '#fff', border: '1px solid #E5D5B3', padding: '30px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr 1fr 1fr', paddingBottom: '15px', borderBottom: '1px solid #E5D5B3', fontSize: '12px', fontWeight: 600, color: '#767676', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            <span>Product</span>
            <span style={{ textAlign: 'center' }}>Price</span>
            <span style={{ textAlign: 'center' }}>Qty</span>
            <span style={{ textAlign: 'right' }}>Total</span>
          </div>

          {cart.map(item => (
            <div 
              key={item._id} 
              style={{ display: 'grid', gridTemplateColumns: '3fr 1fr 1fr 1fr', alignItems: 'center', padding: '25px 0', borderBottom: '1px solid #F0EDE4' }}
            >
              {/* Product Info */}
              <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                <img 
                  src={item.image} 
                  alt={item.name} 
                  style={{ width: '60px', height: '70px', objectFit: 'cover', border: '1px solid #F0EDE4' }} 
                />
                <div>
                  <Link to={`/product/${item._id}`} style={{ fontWeight: 500, fontSize: '14px', color: '#1C1C1C', display: 'block', marginBottom: '5px' }}>
                    {item.name}
                  </Link>
                  <span style={{ fontSize: '11px', color: '#D4AF37', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{item.category}</span>
                </div>
              </div>

              {/* Price */}
              <div style={{ textAlign: 'center', fontSize: '15px' }}>{formatPrice(item.price)}</div>

              {/* Qty Controls */}
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #E5D5B3', backgroundColor: '#FFF' }}>
                  <button 
                    onClick={() => updateQuantity(item._id, item.quantity - 1)}
                    style={{ background: 'none', border: 'none', width: '25px', height: '30px', cursor: 'pointer' }}
                  >
                    <Minus size={10} />
                  </button>
                  <span style={{ padding: '0 8px', fontSize: '13px', fontWeight: 600 }}>{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                    style={{ background: 'none', border: 'none', width: '25px', height: '30px', cursor: 'pointer' }}
                  >
                    <Plus size={10} />
                  </button>
                </div>
              </div>

              {/* Total Price */}
              <div style={{ textAlign: 'right', fontWeight: 600, color: '#6B1D2F', fontSize: '15px' }}>
                {formatPrice(item.price * item.quantity)}
              </div>
            </div>
          ))}

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px' }}>
            <Link to="/shop" className="btn btn-outline btn-sm">← Continue Shopping</Link>
            <p style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#767676' }}>
              <Truck size={16} style={{ color: '#D4AF37' }} />
              {cartSubtotal >= 150 ? 'Eligible for Free Worldwide Shipping!' : `Add ${formatPrice(150 - cartSubtotal)} more for FREE shipping`}
            </p>
          </div>
        </div>

        {/* Right Side: Order Summary Card */}
        <div style={{ backgroundColor: '#FCFBF7', border: '1px solid #E5D5B3', padding: '30px' }}>
          <h3 style={{ borderBottom: '1px solid #E5D5B3', paddingBottom: '15px', color: '#6B1D2F', fontSize: '20px' }}>Summary</h3>

          {/* Pricing Row details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', margin: '20px 0', borderBottom: '1px solid #E5D5B3', paddingBottom: '20px', fontSize: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Subtotal</span>
              <span style={{ fontWeight: 500 }}>{formatPrice(cartSubtotal)}</span>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Shipping Cost</span>
              <span>{shippingCost === 0 ? 'FREE' : formatPrice(shippingCost)}</span>
            </div>

            {appliedCoupon && (
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#10B981', fontWeight: 500 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  Promo code ({appliedCoupon.code})
                </span>
                <span>-{formatPrice(discountAmount)}</span>
              </div>
            )}
          </div>

          {/* Total Price */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
            <span style={{ fontSize: '16px', fontWeight: 600 }}>Total</span>
            <span style={{ fontSize: '22px', fontWeight: 'bold', color: '#6B1D2F' }}>{formatPrice(cartTotal)}</span>
          </div>

          {/* Coupon Input Area */}
          <div style={{ marginBottom: '30px' }}>
            <h4 style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '10px' }}>Have a Promo Code?</h4>
            {!appliedCoupon ? (
              <form onSubmit={handleApplyCoupon} style={{ display: 'flex', gap: '10px' }}>
                <input
                  type="text"
                  placeholder="e.g. WELCOME10"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  style={{
                    flexGrow: 1,
                    border: '1px solid #E5D5B3',
                    padding: '8px 12px',
                    fontSize: '13px',
                    textTransform: 'uppercase'
                  }}
                />
                <button type="submit" className="btn btn-primary btn-sm" disabled={checkingCoupon}>
                  {checkingCoupon ? '...' : 'Apply'}
                </button>
              </form>
            ) : (
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid #10B981',
                padding: '10px 14px',
                fontSize: '13px'
              }}>
                <span style={{ color: '#10B981', fontWeight: 600 }}>{appliedCoupon.code} Applied</span>
                <button 
                  onClick={handleRemoveCoupon} 
                  style={{ background: 'none', border: 'none', color: '#EF4444', textDecoration: 'underline', cursor: 'pointer', fontWeight: 500 }}
                >
                  Remove
                </button>
              </div>
            )}
            <span style={{ fontSize: '10px', color: '#767676', display: 'block', marginTop: '6px' }}>
              * Try coupon code WELCOME10 for 10% off.
            </span>
          </div>

          {/* Checkout CTA */}
          <button 
            className="btn btn-primary" 
            style={{ width: '100%', padding: '15px' }}
            onClick={() => navigate('/checkout', { state: { coupon: appliedCoupon ? appliedCoupon.code : null } })}
          >
            Checkout Securely
          </button>
          
          <div style={{ textAlign: 'center', marginTop: '15px' }}>
            <span style={{ fontSize: '11px', color: '#767676' }}>
              🔒 Safe Checkout Guaranteed. Shipped in 5-7 business days.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
