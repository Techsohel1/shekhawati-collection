import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppState';
import { useCurrency } from '../context/CurrencyContext';
import { CreditCard, ShieldCheck, ShoppingBag, Download, ArrowRight, Truck } from 'lucide-react';
import { API_URL } from '../config';

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cart, user, clearCart, showAlert } = useApp();
  const { formatPrice } = useCurrency();

  // Redirect to cart if empty
  useEffect(() => {
    if (cart.length === 0 && !orderSuccessData) {
      navigate('/cart');
    }
  }, [cart]);

  // Form States
  const [email, setEmail] = useState(user ? user.email : '');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');
  const [country, setCountry] = useState('US');

  // Coupon and Points Redemptions
  const [couponCode, setCouponCode] = useState(location.state?.coupon || '');
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [pointsRedeemed, setPointsRedeemed] = useState(0);
  const [pointsDiscount, setPointsDiscount] = useState(0);
  const [pointsInput, setPointsInput] = useState(0);

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState('stripe');
  
  // Card Details (mock)
  const [cardNumber, setCardNumber] = useState('4242 4242 4242 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('123');

  // State flags
  const [submittingOrder, setSubmittingOrder] = useState(false);
  const [orderSuccessData, setOrderSuccessData] = useState(null);

  // Pre-validate coupon if passed from cart
  useEffect(() => {
    if (couponCode) {
      validateAndApplyCoupon(couponCode);
    }
  }, [couponCode]);

  // Calculate pricing metrics
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingCost = subtotal >= 150 || subtotal === 0 ? 0 : 15;

  const validateAndApplyCoupon = async (code) => {
    if (!code) return;
    try {
      const res = await fetch(`${API_URL}/api/utils/coupons/${code.toUpperCase()}`);
      const data = await res.json();
      if (res.ok) {
        if (subtotal >= data.minPurchase) {
          let discount = 0;
          if (data.discountType === 'percentage') {
            discount = parseFloat(((subtotal * data.discountValue) / 100).toFixed(2));
          } else {
            discount = data.discountValue;
          }
          setCouponDiscount(discount);
        }
      }
    } catch (err) {
      console.log('Error validating coupon in checkout:', err);
    }
  };

  const handleApplyPoints = (e) => {
    e.preventDefault();
    if (!user) return;
    const pts = parseInt(pointsInput);
    if (isNaN(pts) || pts <= 0) {
      showAlert('Please enter a valid amount of points.', 'error');
      return;
    }
    if (pts > user.rewardPoints) {
      showAlert(`You only have ${user.rewardPoints} points available.`, 'error');
      return;
    }

    // Points value: 1 point = $0.10. Max points to use cannot make total negative
    const pointsValue = parseFloat((pts * 0.1).toFixed(2));
    const maxDiscountAllowed = subtotal + shippingCost - couponDiscount;
    const finalPointsDiscount = Math.min(pointsValue, maxDiscountAllowed);
    
    // Recalculate points actually used based on finalPointsDiscount
    const actualPointsUsed = Math.round(finalPointsDiscount / 0.1);

    setPointsRedeemed(actualPointsUsed);
    setPointsDiscount(finalPointsDiscount);
    showAlert(`Redeemed ${actualPointsUsed} points (Saving ${formatPrice(finalPointsDiscount)}).`, 'success');
  };

  const handleRemovePoints = () => {
    setPointsRedeemed(0);
    setPointsDiscount(0);
    setPointsInput(0);
    showAlert('Redeemed points removed.', 'info');
  };

  const finalTotal = parseFloat((subtotal + shippingCost - couponDiscount - pointsDiscount).toFixed(2));

  // Submit Order Process
  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!email || !firstName || !lastName || !address || !city || !state || !zip || !phone) {
      showAlert('Please fill in all shipping details.', 'error');
      return;
    }

    setSubmittingOrder(true);
    try {
      const orderPayload = {
        userId: user ? user.id : 'guest',
        guestDetails: user ? null : { name: `${firstName} ${lastName}`, email, phone },
        items: cart,
        shippingAddress: {
          name: `${firstName} ${lastName}`,
          address,
          city,
          state,
          zip,
          country,
          phone
        },
        paymentMethod: paymentMethod.toUpperCase(),
        couponCode: couponDiscount > 0 ? couponCode : null,
        pointsToRedeem: pointsRedeemed
      };

      const res = await fetch(`${API_URL}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });
      const data = await res.json();

      if (res.ok) {
        setOrderSuccessData(data);
        clearCart();
        showAlert('Order placed successfully! Welcome to Shekhawati Collection.', 'success');
      } else {
        showAlert(data.message || 'Error processing order.', 'error');
      }
    } catch (err) {
      showAlert('Could not connect to the order server.', 'error');
    } finally {
      setSubmittingOrder(false);
    }
  };

  // HTML Print View Invoice Download Mockup
  const handleDownloadInvoice = () => {
    if (!orderSuccessData) return;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice - ${orderSuccessData.trackingNumber}</title>
          <style>
            body { font-family: 'Georgia', serif; color: #1C1C1C; padding: 40px; background-color: #FCFBF7; }
            .invoice-box { max-width: 800px; margin: auto; padding: 30px; border: 1px solid #E5D5B3; background-color: #FFF; box-shadow: 0 0 10px rgba(0,0,0,0.05); }
            .header { border-bottom: 2px solid #6B1D2F; padding-bottom: 20px; display: flex; justify-content: space-between; align-items: center; }
            .logo { font-size: 24px; font-weight: bold; color: #6B1D2F; }
            .meta { font-size: 13px; line-height: 1.6; text-align: right; }
            .address-box { margin-top: 30px; display: grid; grid-template-columns: 1fr 1fr; gap: 20px; font-size: 14px; line-height: 1.5; }
            .address-title { font-weight: bold; color: #6B1D2F; text-transform: uppercase; font-size: 12px; margin-bottom: 8px; border-bottom: 1px solid #F0EDE4; padding-bottom: 4px; }
            .table { width: 100%; margin-top: 40px; border-collapse: collapse; }
            .table th { border-bottom: 2px solid #E5D5B3; padding: 10px; font-size: 13px; text-transform: uppercase; color: #767676; text-align: left; }
            .table td { border-bottom: 1px solid #F0EDE4; padding: 12px 10px; font-size: 14px; }
            .summary { margin-top: 30px; text-align: right; width: 300px; margin-left: auto; font-size: 14px; line-height: 1.8; }
            .total { font-size: 18px; font-weight: bold; color: #6B1D2F; border-top: 2px solid #6B1D2F; padding-top: 10px; margin-top: 10px; }
            .footer { border-top: 1px solid #E5D5B3; margin-top: 50px; padding-top: 20px; text-align: center; font-size: 12px; color: #767676; }
          </style>
        </head>
        <body>
          <div class="invoice-box">
            <div class="header">
              <div class="logo">🏰 Shekhawati Collection</div>
              <div class="meta">
                <strong>Order ID:</strong> #${orderSuccessData._id}<br/>
                <strong>Tracking:</strong> ${orderSuccessData.trackingNumber}<br/>
                <strong>Date:</strong> ${new Date(orderSuccessData.createdAt).toLocaleDateString()}<br/>
              </div>
            </div>
            
            <div class="address-box">
              <div>
                <div class="address-title">Shipped From</div>
                Shekhawati Royal Crafts Depot<br/>
                Shekhawati Region, Rajasthan<br/>
                India<br/>
                Support: shekhawaticollection@gmail.com
              </div>
              <div>
                <div class="address-title">Shipping To</div>
                ${orderSuccessData.shippingAddress.name}<br/>
                ${orderSuccessData.shippingAddress.address}<br/>
                ${orderSuccessData.shippingAddress.city}, ${orderSuccessData.shippingAddress.state} ${orderSuccessData.shippingAddress.zip}<br/>
                ${orderSuccessData.shippingAddress.country}<br/>
                Phone: ${orderSuccessData.shippingAddress.phone}
              </div>
            </div>

            <table class="table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th style="text-align: center;">Price</th>
                  <th style="text-align: center;">Qty</th>
                  <th style="text-align: right;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${orderSuccessData.items.map(item => `
                  <tr>
                    <td>${item.name}</td>
                    <td style="text-align: center;">$${item.price.toFixed(2)}</td>
                    <td style="text-align: center;">${item.quantity}</td>
                    <td style="text-align: right;">$${(item.price * item.quantity).toFixed(2)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>

            <div class="summary">
              <div style="display: flex; justify-content: space-between;">
                <span>Subtotal</span>
                <span>$${subtotal.toFixed(2)}</span>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span>Shipping</span>
                <span>${orderSuccessData.shippingCost === 0 ? 'FREE' : `$${orderSuccessData.shippingCost.toFixed(2)}`}</span>
              </div>
              ${orderSuccessData.discountAmount > 0 ? `
                <div style="display: flex; justify-content: space-between; color: #10B981;">
                  <span>Discounts Applied</span>
                  <span>-$${orderSuccessData.discountAmount.toFixed(2)}</span>
                </div>
              ` : ''}
              <div class="total" style="display: flex; justify-content: space-between;">
                <span>Total Settled</span>
                <span>$${orderSuccessData.totalAmount.toFixed(2)}</span>
              </div>
            </div>

            <div class="footer">
              Thank you for supporting hand-crafted global artisans.<br/>
              Order Status: <strong>${orderSuccessData.paymentStatus} & ${orderSuccessData.shippingStatus}</strong><br/>
              Estimated Delivery: ${orderSuccessData.estimatedDelivery}
            </div>
          </div>
          <script>window.print();</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // SUCCESS SCREEN
  if (orderSuccessData) {
    return (
      <div className="container section-padding" style={{ maxWidth: '700px' }}>
        <div style={{
          backgroundColor: '#fff',
          border: '1px solid #E5D5B3',
          padding: '50px',
          textAlign: 'center',
          boxShadow: '0 15px 40px rgba(0,0,0,0.05)'
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            backgroundColor: 'rgba(107,29,47,0.08)',
            color: 'var(--color-primary-burgundy)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '20px'
          }}>
            <ShieldCheck size={36} />
          </div>

          <h2 style={{ fontSize: '32px', color: '#6B1D2F', marginBottom: '15px' }}>Royal Order Placed!</h2>
          <p style={{ color: '#767676', fontSize: '15px', marginBottom: '30px', lineHeight: 1.6 }}>
            Thank you for shopping at Shekhawati Collection. Your transaction was processed successfully. An email with tracking updates has been sent to <strong style={{ color: '#1C1C1C' }}>{email}</strong>.
          </p>

          <div style={{
            backgroundColor: '#FCFBF7',
            border: '1px solid #E5D5B3',
            padding: '25px',
            marginBottom: '35px',
            fontSize: '14px',
            textAlign: 'left',
            lineHeight: 1.8
          }}>
            <div><strong>Order ID:</strong> #{orderSuccessData._id}</div>
            <div><strong>Tracking Number:</strong> <span style={{ color: '#6B1D2F', fontWeight: 'bold' }}>{orderSuccessData.trackingNumber}</span></div>
            <div><strong>Estimated Delivery:</strong> {orderSuccessData.estimatedDelivery} (5-7 Business Days)</div>
            <div><strong>Shipping Region:</strong> USA, UK, Europe, Canada, Australia</div>
          </div>

          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
            <button className="btn btn-outline" onClick={handleDownloadInvoice}>
              <Download size={14} style={{ marginRight: '8px' }} /> Download Invoice
            </button>
            <button className="btn btn-primary" onClick={() => navigate('/shop')}>
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container section-padding">
      <div className="section-header">
        <span className="subtitle">Secure checkout</span>
        <h2>Complete Order</h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.7fr 1.3fr', gap: '40px', alignItems: 'flex-start' }}>
        
        {/* Left Side: Shipping and Payments form */}
        <form onSubmit={handlePlaceOrder} style={{ backgroundColor: '#fff', border: '1px solid #E5D5B3', padding: '30px' }}>
          
          {/* Section 1: Customer Contact */}
          <h3 style={{ color: '#6B1D2F', fontSize: '18px', marginBottom: '20px', borderBottom: '1px solid #F0EDE4', paddingBottom: '10px' }}>
            1. Contact Details
          </h3>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input 
              type="email" 
              className="form-control" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. buyer@domain.com"
              disabled={!!user} // Locked to user email if logged in
            />
          </div>

          {/* Section 2: Shipping Destination */}
          <h3 style={{ color: '#6B1D2F', fontSize: '18px', marginTop: '35px', marginBottom: '20px', borderBottom: '1px solid #F0EDE4', paddingBottom: '10px' }}>
            2. Shipping Address
          </h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div className="form-group">
              <label className="form-label">First Name</label>
              <input type="text" className="form-control" required value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Last Name</label>
              <input type="text" className="form-control" required value={lastName} onChange={(e) => setLastName(e.target.value)} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Street Address</label>
            <input type="text" className="form-control" required placeholder="Apartment, suite, unit, street number..." value={address} onChange={(e) => setAddress(e.target.value)} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div className="form-group">
              <label className="form-label">City</label>
              <input type="text" className="form-control" required value={city} onChange={(e) => setCity(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">State / Province</label>
              <input type="text" className="form-control" required value={state} onChange={(e) => setState(e.target.value)} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div className="form-group">
              <label className="form-label">Zip / Postal Code</label>
              <input type="text" className="form-control" required value={zip} onChange={(e) => setZip(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Country</label>
              <select className="form-control" value={country} onChange={(e) => setCountry(e.target.value)} style={{ cursor: 'pointer' }}>
                <option value="US">🇺🇸 United States</option>
                <option value="GB">🇬🇧 United Kingdom</option>
                <option value="EU">🇪🇺 Europe</option>
                <option value="CA">🇨🇦 Canada</option>
                <option value="AU">🇦🇺 Australia</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Phone Number (with Country Code)</label>
            <input type="tel" className="form-control" required placeholder="e.g. +1 555-0199" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>

          {/* Section 3: Secure Payments */}
          <h3 style={{ color: '#6B1D2F', fontSize: '18px', marginTop: '35px', marginBottom: '20px', borderBottom: '1px solid #F0EDE4', paddingBottom: '10px' }}>
            3. Payment Method
          </h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '25px' }}>
            <div 
              style={{
                border: `1px solid ${paymentMethod === 'stripe' ? '#6B1D2F' : '#E5D5B3'}`,
                backgroundColor: paymentMethod === 'stripe' ? '#F9F5EA' : 'transparent',
                padding: '12px',
                textAlign: 'center',
                cursor: 'pointer',
                fontWeight: 500,
                fontSize: '13px'
              }}
              onClick={() => setPaymentMethod('stripe')}
            >
              💳 Stripe / Cards
            </div>
            <div 
              style={{
                border: `1px solid ${paymentMethod === 'paypal' ? '#6B1D2F' : '#E5D5B3'}`,
                backgroundColor: paymentMethod === 'paypal' ? '#F9F5EA' : 'transparent',
                padding: '12px',
                textAlign: 'center',
                cursor: 'pointer',
                fontWeight: 500,
                fontSize: '13px'
              }}
              onClick={() => setPaymentMethod('paypal')}
            >
              🅿️ PayPal
            </div>
            <div 
              style={{
                border: `1px solid ${paymentMethod === 'mobile' ? '#6B1D2F' : '#E5D5B3'}`,
                backgroundColor: paymentMethod === 'mobile' ? '#F9F5EA' : 'transparent',
                padding: '12px',
                textAlign: 'center',
                cursor: 'pointer',
                fontWeight: 500,
                fontSize: '13px'
              }}
              onClick={() => setPaymentMethod('mobile')}
            >
              📱 Apple / Google
            </div>
          </div>

          {paymentMethod === 'stripe' && (
            <div style={{
              backgroundColor: '#FCFBF7',
              border: '1px solid #E5D5B3',
              padding: '20px',
              borderRadius: '2px',
              fontSize: '13px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '15px', color: '#6B1D2F', fontWeight: 600 }}>
                <CreditCard size={16} /> Enter Card Details
              </div>
              <div className="form-group">
                <label className="form-label" style={{ fontSize: '11px' }}>Card Number</label>
                <input type="text" className="form-control" style={{ padding: '8px 12px' }} value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} required />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '11px' }}>Expiry</label>
                  <input type="text" className="form-control" style={{ padding: '8px 12px' }} value={cardExpiry} onChange={(e) => setCardExpiry(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '11px' }}>CVV</label>
                  <input type="text" className="form-control" style={{ padding: '8px 12px' }} value={cardCvv} onChange={(e) => setCardCvv(e.target.value)} required />
                </div>
              </div>
            </div>
          )}

          {paymentMethod === 'paypal' && (
            <div style={{ backgroundColor: '#FCFBF7', border: '1px solid #E5D5B3', padding: '25px', textAlign: 'center', fontSize: '13px', color: '#767676' }}>
              <p>Upon clicking "Complete Order", you will be redirected to the secure PayPal login modal to authorize the transactions.</p>
            </div>
          )}

          {paymentMethod === 'mobile' && (
            <div style={{ backgroundColor: '#FCFBF7', border: '1px solid #E5D5B3', padding: '25px', textAlign: 'center', fontSize: '13px', color: '#767676' }}>
              <p>Requires Apple Pay or Google Pay compatibility. Mock token verification will be processed instantly.</p>
            </div>
          )}

          {/* Secure Badge */}
          <div style={{ marginTop: '30px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px', color: '#767676', justifyContent: 'center' }}>
            <ShieldCheck size={16} style={{ color: '#D4AF37' }} />
            <span>256-Bit SSL Encrypted secure checkout processing.</span>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', padding: '15px', marginTop: '25px', fontSize: '15px' }}
            disabled={submittingOrder}
          >
            {submittingOrder ? 'Processing Royal Order...' : `Complete Order & Settle ${formatPrice(finalTotal)}`}
          </button>
        </form>

        {/* Right Side: Order Summary + Coupon + Reward Points */}
        <div>
          {/* Order items overview */}
          <div style={{ backgroundColor: '#FCFBF7', border: '1px solid #E5D5B3', padding: '30px', marginBottom: '30px' }}>
            <h3 style={{ borderBottom: '1px solid #E5D5B3', paddingBottom: '15px', color: '#6B1D2F', fontSize: '18px' }}>Your Bag</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', margin: '20px 0' }}>
              {cart.map(item => (
                <div key={item._id} style={{ display: 'flex', gap: '12px', alignItems: 'center', fontSize: '13px' }}>
                  <img src={item.image} alt={item.name} style={{ width: '40px', height: '48px', objectFit: 'cover', border: '1px solid #F0EDE4' }} />
                  <div style={{ flexGrow: 1 }}>
                    <span style={{ fontWeight: 500, display: 'block', color: '#1C1C1C' }}>{item.name}</span>
                    <span style={{ color: '#767676' }}>Qty: {item.quantity}</span>
                  </div>
                  <span style={{ fontWeight: 600 }}>{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px', borderTop: '1px solid #E5D5B3', paddingTop: '15px', borderBottom: '1px solid #E5D5B3', paddingBottom: '15px', marginBottom: '15px' }}>
              <div style={{ display: 'flex', justifyContext: 'space-between', justifyContent: 'space-between' }}>
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div style={{ display: 'flex', justifyContext: 'space-between', justifyContent: 'space-between' }}>
                <span>Shipping Cost</span>
                <span>{shippingCost === 0 ? 'FREE' : formatPrice(shippingCost)}</span>
              </div>
              
              {couponDiscount > 0 && (
                <div style={{ display: 'flex', justifyContext: 'space-between', color: '#10B981', justifyContent: 'space-between' }}>
                  <span>Promo Coupon ({couponCode.toUpperCase()})</span>
                  <span>-{formatPrice(couponDiscount)}</span>
                </div>
              )}

              {pointsDiscount > 0 && (
                <div style={{ display: 'flex', justifyContext: 'space-between', color: '#10B981', justifyContent: 'space-between' }}>
                  <span>Redeemed Points ({pointsRedeemed})</span>
                  <span>-{formatPrice(pointsDiscount)}</span>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', justifyContext: 'space-between', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: 600 }}>Order Total</span>
              <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#6B1D2F' }}>{formatPrice(finalTotal)}</span>
            </div>
          </div>

          {/* Reward Points System Box */}
          {user && (
            <div style={{ backgroundColor: '#FCFBF7', border: '1px solid #E5D5B3', padding: '30px' }}>
              <h3 style={{ color: '#6B1D2F', fontSize: '18px', borderBottom: '1px solid #E5D5B3', paddingBottom: '15px', marginBottom: '20px' }}>
                👑 Reward Points Balance
              </h3>
              <p style={{ fontSize: '13px', color: '#767676', marginBottom: '15px', lineHeight: 1.5 }}>
                You currently have <strong style={{ color: '#6B1D2F' }}>{user.rewardPoints} points</strong> in your account. 
                Redeem them now! (10 points = $1.00 USD value discount).
              </p>

              {pointsRedeemed === 0 ? (
                <form onSubmit={handleApplyPoints} style={{ display: 'flex', gap: '10px' }}>
                  <input
                    type="number"
                    min="1"
                    max={user.rewardPoints}
                    placeholder="Enter points..."
                    className="form-control"
                    style={{ padding: '8px 12px', fontSize: '13px' }}
                    value={pointsInput}
                    onChange={(e) => setPointsInput(parseInt(e.target.value))}
                  />
                  <button type="submit" className="btn btn-primary btn-sm">Redeem</button>
                </form>
              ) : (
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  backgroundColor: 'rgba(212,175,55,0.08)',
                  border: '1px solid #D4AF37',
                  padding: '12px',
                  fontSize: '13px'
                }}>
                  <div>
                    <span style={{ color: '#D4AF37', fontWeight: 600 }}>{pointsRedeemed} Points Applied</span>
                    <span style={{ display: 'block', fontSize: '11px', color: '#767676' }}>Saving {formatPrice(pointsDiscount)}</span>
                  </div>
                  <button 
                    onClick={handleRemovePoints} 
                    style={{ background: 'none', border: 'none', color: '#EF4444', textDecoration: 'underline', cursor: 'pointer', fontWeight: 500 }}
                  >
                    Remove
                  </button>
                </div>
              )}
              <span style={{ fontSize: '11px', color: '#767676', display: 'block', marginTop: '12px' }}>
                🎁 Settle order and earn <strong style={{ color: '#6B1D2F' }}>{Math.floor(finalTotal / 10)} points</strong> on this purchase!
              </span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Checkout;
