import React, { useState } from 'react';
import { X, GitCompare, HelpCircle, Check, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppState';
import { useCurrency } from '../context/CurrencyContext';

const ComparisonDrawer = () => {
  const { compareList, toggleCompare, clearCompare } = useApp();
  const { formatPrice } = useCurrency();
  const [showFullCompare, setShowFullCompare] = useState(false);

  if (compareList.length === 0) return null;

  // Extract all unique specification keys across all products in comparison
  const getAllSpecKeys = () => {
    const keys = new Set();
    compareList.forEach(p => {
      if (p.specifications) {
        Object.keys(p.specifications).forEach(key => keys.add(key));
      }
    });
    return Array.from(keys);
  };

  const specKeys = getAllSpecKeys();

  return (
    <>
      {/* Floating Bottom Drawer */}
      <div className={`compare-drawer open`}>
        <div className="compare-drawer-inner">
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{
              backgroundColor: '#6B1D2F',
              color: '#FFF',
              padding: '10px',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <GitCompare size={20} />
            </div>
            <div>
              <h4 style={{ fontSize: '15px', fontWeight: 600, color: '#1C1C1C' }}>Compare Products ({compareList.length}/3)</h4>
              <p style={{ fontSize: '11px', color: '#767676' }}>Analyze details side-by-side before purchase</p>
            </div>
          </div>

          {/* List of compare slot items */}
          <div className="compare-products">
            {compareList.map(prod => (
              <div className="compare-product-slot" key={prod._id}>
                <img src={prod.images && prod.images[0] ? prod.images[0] : ''} alt={prod.name} className="compare-product-img" />
                <span className="compare-product-title">{prod.name}</span>
                <button className="compare-remove-btn" onClick={() => toggleCompare(prod)}>
                  <X size={10} />
                </button>
              </div>
            ))}

            {/* Empty slots placeholders */}
            {Array.from({ length: 3 - compareList.length }).map((_, idx) => (
              <div 
                className="compare-product-slot" 
                key={idx} 
                style={{ 
                  border: '1px dashed #E5D5B3', 
                  backgroundColor: 'rgba(252, 251, 247, 0.4)',
                  color: '#767676',
                  justifyContent: 'center',
                  fontSize: '11px'
                }}
              >
                + Add item to compare
              </div>
            ))}
          </div>

          {/* Compare actions */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              className="btn btn-primary btn-sm"
              disabled={compareList.length < 2}
              onClick={() => setShowFullCompare(true)}
              style={{
                opacity: compareList.length < 2 ? 0.6 : 1,
                cursor: compareList.length < 2 ? 'not-allowed' : 'pointer'
              }}
            >
              Compare Specs
            </button>
            <button className="btn btn-outline btn-sm" onClick={clearCompare}>
              Clear All
            </button>
          </div>
        </div>
      </div>

      {/* Full Screen Comparison Specs Table Modal */}
      {showFullCompare && (
        <div className="modal-overlay open" style={{ zIndex: 1100 }}>
          <div 
            className="newsletter-modal" 
            style={{ 
              maxWidth: '900px', 
              width: '95%', 
              flexDirection: 'column', 
              padding: '30px',
              backgroundColor: '#FCFBF7'
            }}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid #E5D5B3',
              paddingBottom: '15px',
              marginBottom: '20px'
            }}>
              <h3 style={{ fontStyle: 'italic', fontSize: '24px', color: '#6B1D2F' }}>🏰 Product Comparison Sheet</h3>
              <button 
                onClick={() => setShowFullCompare(false)} 
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#1C1C1C' }}
              >
                <X size={24} />
              </button>
            </div>

            {/* Comparison Grid Table */}
            <div style={{ overflowX: 'auto', maxHeight: '60vh' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #E5D5B3' }}>
                    <th style={{ padding: '12px 10px', color: '#6B1D2F', fontWeight: 600, width: '25%' }}>Feature</th>
                    {compareList.map(prod => (
                      <th key={prod._id} style={{ padding: '12px 10px', width: `${75 / compareList.length}%` }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                          <img 
                            src={prod.images && prod.images[0] ? prod.images[0] : ''} 
                            alt={prod.name} 
                            style={{ width: '60px', height: '70px', objectFit: 'cover', marginBottom: '8px', border: '1px solid #F0EDE4' }} 
                          />
                          <span style={{ fontWeight: 600, fontSize: '13px', display: 'block', height: '36px', overflow: 'hidden' }}>{prod.name}</span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {/* Category */}
                  <tr style={{ borderBottom: '1px solid #F0EDE4' }}>
                    <td style={{ padding: '12px 10px', fontWeight: 600, color: '#767676' }}>Category</td>
                    {compareList.map(prod => (
                      <td key={prod._id} style={{ padding: '12px 10px', textAlign: 'center' }}>{prod.category}</td>
                    ))}
                  </tr>

                  {/* Price */}
                  <tr style={{ borderBottom: '1px solid #F0EDE4' }}>
                    <td style={{ padding: '12px 10px', fontWeight: 600, color: '#767676' }}>Price</td>
                    {compareList.map(prod => (
                      <td key={prod._id} style={{ padding: '12px 10px', textAlign: 'center', color: '#6B1D2F', fontWeight: 'bold', fontSize: '16px' }}>
                        {formatPrice(prod.price)}
                      </td>
                    ))}
                  </tr>

                  {/* Stock Status */}
                  <tr style={{ borderBottom: '1px solid #F0EDE4' }}>
                    <td style={{ padding: '12px 10px', fontWeight: 600, color: '#767676' }}>Availability</td>
                    {compareList.map(prod => (
                      <td key={prod._id} style={{ padding: '12px 10px', textAlign: 'center' }}>
                        <span style={{
                          color: prod.stock > 0 ? '#10B981' : '#EF4444',
                          fontWeight: 500,
                          fontSize: '13px'
                        }}>
                          {prod.stock > 0 ? `In Stock (${prod.stock})` : 'Out of Stock'}
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* Ratings */}
                  <tr style={{ borderBottom: '1px solid #F0EDE4' }}>
                    <td style={{ padding: '12px 10px', fontWeight: 600, color: '#767676' }}>Rating</td>
                    {compareList.map(prod => (
                      <td key={prod._id} style={{ padding: '12px 10px', textAlign: 'center' }}>
                        <span style={{ color: '#D4AF37', fontWeight: 'bold' }}>★ {prod.rating || '5.0'}</span> ({prod.reviewsCount || 0} reviews)
                      </td>
                    ))}
                  </tr>

                  {/* Dynamic Technical Specs */}
                  {specKeys.map(key => (
                    <tr key={key} style={{ borderBottom: '1px solid #F0EDE4' }}>
                      <td style={{ padding: '12px 10px', fontWeight: 600, color: '#767676', textTransform: 'capitalize' }}>{key}</td>
                      {compareList.map(prod => (
                        <td key={prod._id} style={{ padding: '12px 10px', textAlign: 'center' }}>
                          {(prod.specifications && prod.specifications[key]) ? prod.specifications[key] : '—'}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
              <button className="btn btn-outline" onClick={() => setShowFullCompare(false)}>Close Sheet</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ComparisonDrawer;
