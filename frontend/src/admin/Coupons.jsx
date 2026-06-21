import React, { useState } from 'react';
import { Ticket, Plus, Tag, ShieldCheck, HelpCircle } from 'lucide-react';

const Coupons = ({ coupons, formatPrice, showAlert }) => {
  const [couponCode, setCouponCode] = useState('');
  const [discountType, setDiscountType] = useState('percentage');
  const [discountVal, setDiscountVal] = useState('');
  const [minPurchase, setMinPurchase] = useState('0');
  const [localCoupons, setLocalCoupons] = useState(coupons);

  const handleCreateCoupon = (e) => {
    e.preventDefault();
    if (!couponCode || !discountVal) {
      showAlert('Please enter core fields.', 'error');
      return;
    }

    const newCode = couponCode.toUpperCase().replace(/\s+/g, '');
    
    // Check duplication
    if (localCoupons.some(c => c.code === newCode)) {
      showAlert('Coupon code already exists.', 'error');
      return;
    }

    const newC = {
      code: newCode,
      discountType: discountType,
      discountValue: parseFloat(discountVal),
      minPurchase: parseFloat(minPurchase) || 0,
      isActive: true
    };

    setLocalCoupons(prev => [newC, ...prev]);
    showAlert(`Coupon code ${newCode} spawned successfully!`, 'success');
    
    // Reset form
    setCouponCode('');
    setDiscountVal('');
    setMinPurchase('0');
  };

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1.2fr 0.8fr',
      gap: '30px',
      alignItems: 'stretch'
    }}>
      
      {/* 1. LEFT PANEL: Active Coupons Grid */}
      <div style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #E5D5B3',
        borderRadius: '8px',
        padding: '24px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <div>
          <h4 style={{ color: '#6B1D2F', fontSize: '18px', fontWeight: 600 }}>Active Promo Coupons</h4>
          <span style={{ fontSize: '12px', color: '#767676' }}>List of active shopping vouchers and discount triggers</span>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          gap: '20px',
          maxHeight: '65vh',
          overflowY: 'auto',
          paddingRight: '6px'
        }}>
          {localCoupons.map((c) => (
            <div 
              key={c.code}
              style={{
                backgroundColor: '#FAF8F3',
                border: '1px dashed #D4AF37',
                borderRadius: '8px',
                padding: '20px',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.02)',
                overflow: 'hidden'
              }}
            >
              {/* Punch-hole Ticket decoration left/right */}
              <div style={{ position: 'absolute', width: '12px', height: '24px', backgroundColor: '#FFFFFF', border: '1px solid #E5D5B3', borderLeft: 'none', borderRadius: '0 12px 12px 0', left: '-1px', top: 'calc(50% - 12px)' }}></div>
              <div style={{ position: 'absolute', width: '12px', height: '24px', backgroundColor: '#FFFFFF', border: '1px solid #E5D5B3', borderRight: 'none', borderRadius: '12px 0 0 12px', right: '-1px', top: 'calc(50% - 12px)' }}></div>

              {/* Title & Tag */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span style={{ 
                  fontSize: '18px', 
                  fontWeight: 700, 
                  color: '#6B1D2F', 
                  letterSpacing: '1px',
                  fontFamily: 'monospace'
                }}>
                  🎟️ {c.code}
                </span>
                
                <span style={{
                  backgroundColor: 'rgba(16,185,129,0.08)',
                  color: '#10B981',
                  border: '1px solid rgba(16,185,129,0.2)',
                  fontSize: '10px',
                  fontWeight: 600,
                  padding: '3px 8px',
                  borderRadius: '10px',
                  textTransform: 'uppercase'
                }}>
                  Active
                </span>
              </div>

              {/* Discount Amount */}
              <div style={{ borderBottom: '1px dashed #E5D5B3', paddingBottom: '10px', marginTop: '5px' }}>
                <span style={{ fontSize: '12px', color: '#767676' }}>Discount Deduction:</span>
                <h4 style={{ fontSize: '22px', fontWeight: 700, color: '#1C1C1C', marginTop: '2px' }}>
                  {c.discountType === 'percentage' ? `${c.discountValue}% Off` : `$${c.discountValue} Flat`}
                </h4>
              </div>

              {/* Min Purchase conditions */}
              <div style={{ fontSize: '11px', color: '#767676', display: 'flex', justifyContent: 'space-between' }}>
                <span>Min Purchase:</span>
                <strong style={{ color: '#1C1C1C' }}>{formatPrice(c.minPurchase)}</strong>
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* 2. RIGHT PANEL: Spawn Coupon Form */}
      <div style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #E5D5B3',
        borderRadius: '8px',
        padding: '24px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <div>
          <h4 style={{ color: '#6B1D2F', fontSize: '18px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Plus size={18} style={{ color: '#D4AF37' }} /> Spawn Coupon Code
          </h4>
          <span style={{ fontSize: '12px', color: '#767676' }}>Generate a new promo voucher for custom checkout campaigns</span>
        </div>

        <form onSubmit={handleCreateCoupon} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600, color: '#767676' }}>
              Coupon Code *
            </label>
            <input 
              type="text" 
              className="form-control" 
              required 
              value={couponCode} 
              onChange={(e) => setCouponCode(e.target.value)} 
              placeholder="e.g. MONSOON25"
              style={{
                padding: '10px 12px',
                border: '1px solid #E5D5B3',
                borderRadius: '4px',
                fontSize: '13px',
                textTransform: 'uppercase'
              }}
            />
          </div>

          <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600, color: '#767676' }}>
              Discount Type *
            </label>
            <select 
              className="form-control" 
              value={discountType} 
              onChange={(e) => setDiscountType(e.target.value)}
              style={{
                padding: '10px 12px',
                border: '1px solid #E5D5B3',
                borderRadius: '4px',
                fontSize: '13px',
                backgroundColor: '#FFFFFF',
                cursor: 'pointer'
              }}
            >
              <option value="percentage">Percentage (%)</option>
              <option value="flat">Flat Dollar Amount ($)</option>
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600, color: '#767676' }}>
                Value *
              </label>
              <input 
                type="number" 
                className="form-control" 
                required 
                value={discountVal} 
                onChange={(e) => setDiscountVal(e.target.value)} 
                placeholder="e.g. 15"
                style={{
                  padding: '10px 12px',
                  border: '1px solid #E5D5B3',
                  borderRadius: '4px',
                  fontSize: '13px'
                }}
              />
            </div>
            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600, color: '#767676' }}>
                Min Purchase ($)
              </label>
              <input 
                type="number" 
                className="form-control" 
                value={minPurchase} 
                onChange={(e) => setMinPurchase(e.target.value)} 
                placeholder="0"
                style={{
                  padding: '10px 12px',
                  border: '1px solid #E5D5B3',
                  borderRadius: '4px',
                  fontSize: '13px'
                }}
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ 
              width: '100%', 
              padding: '12px', 
              marginTop: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <Plus size={16} /> Spawn Promo Ticket
          </button>
        </form>
      </div>

    </div>
  );
};

export default Coupons;
