import React, { useState } from 'react';
import { Search, Eye, Calendar, MapPin, DollarSign, Award, X, Printer } from 'lucide-react';

const Orders = ({ orders, formatPrice, handleStatusChange }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Status badge styling generator
  const getStatusStyle = (status) => {
    switch (status) {
      case 'Ordered':
        return { bg: '#FEF3C7', color: '#D97706', label: 'Ordered' };
      case 'Processing':
        return { bg: '#FFEDD5', color: '#EA580C', label: 'Processing' };
      case 'Shipped':
        return { bg: '#DBEAFE', color: '#2563EB', label: 'Shipped' };
      case 'Out for Delivery':
        return { bg: '#E0F2FE', color: '#0284C7', label: 'Out for Delivery' };
      case 'Delivered':
        return { bg: '#D1FAE5', color: '#059669', label: 'Delivered' };
      default:
        return { bg: '#F3F4F6', color: '#4B5563', label: status };
    }
  };

  // Filter orders based on status tab and search queries
  const filteredOrders = orders.filter(o => {
    const matchesStatus = statusFilter === 'All' || o.shippingStatus === statusFilter;
    
    const term = searchQuery.toLowerCase();
    const matchesSearch = 
      (o.trackingNumber && o.trackingNumber.toLowerCase().includes(term)) ||
      (o.shippingAddress?.name && o.shippingAddress.name.toLowerCase().includes(term)) ||
      (o.shippingAddress?.email && o.shippingAddress.email.toLowerCase().includes(term)) ||
      (o.shippingAddress?.city && o.shippingAddress.city.toLowerCase().includes(term)) ||
      (o.shippingAddress?.country && o.shippingAddress.country.toLowerCase().includes(term)) ||
      (o.guestDetails?.email && o.guestDetails.email.toLowerCase().includes(term)) ||
      (o.guestDetails?.name && o.guestDetails.name.toLowerCase().includes(term));

    return matchesStatus && matchesSearch;
  });

  const orderStats = {
    total: orders.length,
    ordered: orders.filter(o => o.shippingStatus === 'Ordered').length,
    processing: orders.filter(o => o.shippingStatus === 'Processing').length,
    shipped: orders.filter(o => o.shippingStatus === 'Shipped').length,
    delivered: orders.filter(o => o.shippingStatus === 'Delivered').length,
  };

  const handlePrint = (order) => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice - ${order.trackingNumber}</title>
          <style>
            body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333; padding: 40px; }
            .invoice-box { max-width: 800px; margin: auto; border: 1px solid #eee; box-shadow: 0 0 10px rgba(0, 0, 0, .15); padding: 30px; font-size: 16px; line-height: 24px; }
            .title { font-size: 28px; color: #6B1D2F; font-weight: bold; }
            .subtitle { font-size: 12px; color: #777; text-transform: uppercase; letter-spacing: 2px; }
            table { width: 100%; line-height: inherit; text-align: left; border-collapse: collapse; margin-top: 30px; }
            table th { background: #FAF8F3; border-bottom: 2px solid #E5D5B3; padding: 12px; font-weight: bold; text-transform: uppercase; font-size: 12px; }
            table td { padding: 12px; border-bottom: 1px solid #eee; }
            .total { font-weight: bold; font-size: 18px; color: #6B1D2F; text-align: right; }
            .header-table td { border: none; padding: 0 0 20px 0; }
          </style>
        </head>
        <body>
          <div class="invoice-box">
            <table class="header-table">
              <tr>
                <td>
                  <span class="title">SHEKHAWATI COLLECTION</span><br/>
                  <span class="subtitle">Premium Couture & Couture</span>
                </td>
                <td style="text-align: right;">
                  <strong>Tracking ID:</strong> ${order.trackingNumber}<br/>
                  <strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}<br/>
                  <strong>Status:</strong> ${order.shippingStatus}
                </td>
              </tr>
            </table>
            <hr style="border: 0; border-top: 1px solid #E5D5B3; margin: 20px 0;" />
            <table style="margin-bottom: 20px;">
              <tr>
                <td style="width: 50%; vertical-align: top; border: none; padding: 0;">
                  <strong>Customer Details:</strong><br/>
                  Name: ${order.shippingAddress?.name || 'Guest Client'}<br/>
                  Email: ${order.shippingAddress?.email || order.guestDetails?.email || 'N/A'}<br/>
                  Phone: ${order.shippingAddress?.phone || order.guestDetails?.phone || 'N/A'}
                </td>
                <td style="width: 50%; vertical-align: top; border: none; padding: 0;">
                  <strong>Shipping Address:</strong><br/>
                  ${order.shippingAddress?.addressLine || 'N/A'}<br/>
                  ${order.shippingAddress?.city}, ${order.shippingAddress?.state || ''} - ${order.shippingAddress?.zipCode || ''}<br/>
                  <strong>Country:</strong> ${order.shippingAddress?.country || 'N/A'}
                </td>
              </tr>
            </table>
            <table>
              <thead>
                <tr>
                  <th>Product Details</th>
                  <th style="text-align: center;">Qty</th>
                  <th style="text-align: right;">Unit Price</th>
                  <th style="text-align: right;">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                ${order.items.map(item => `
                  <tr>
                    <td>${item.productName || item.product?.name || 'Premium Handcrafted Item'}</td>
                    <td style="text-align: center;">${item.quantity}</td>
                    <td style="text-align: right;">$${(item.price).toFixed(2)}</td>
                    <td style="text-align: right;">$${(item.price * item.quantity).toFixed(2)}</td>
                  </tr>
                `).join('')}
                <tr>
                  <td colspan="2" style="border: none;"></td>
                  <td style="text-align: right; font-weight: bold;">Subtotal:</td>
                  <td style="text-align: right;">$${order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}</td>
                </tr>
                ${order.couponApplied ? `
                  <tr>
                    <td colspan="2" style="border: none;"></td>
                    <td style="text-align: right; font-weight: bold; color: #059669;">Promo Discount:</td>
                    <td style="text-align: right; color: #059669;">- ${order.couponApplied.code}</td>
                  </tr>
                ` : ''}
                <tr>
                  <td colspan="2" style="border: none;"></td>
                  <td style="text-align: right; font-weight: bold; font-size: 16px; color: #6B1D2F;">Grand Total Paid:</td>
                  <td style="text-align: right; font-weight: bold; font-size: 16px; color: #6B1D2F;">$${order.totalAmount.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
            <div style="margin-top: 40px; text-align: center; font-size: 12px; color: #999;">
              Thank you for ordering with Shekhawati Collection. For inquiries, email shekhawaticollection@gmail.com
            </div>
          </div>
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
      
      {/* 1. Filtering Stats Tabs */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '12px',
        borderBottom: '1px solid #FAF8F3',
        paddingBottom: '15px'
      }}>
        {[
          { id: 'All', label: 'All Orders', count: orderStats.total },
          { id: 'Ordered', label: 'Ordered', count: orderStats.ordered },
          { id: 'Processing', label: 'Processing', count: orderStats.processing },
          { id: 'Shipped', label: 'Shipped', count: orderStats.shipped },
          { id: 'Delivered', label: 'Delivered', count: orderStats.delivered }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setStatusFilter(tab.id)}
            style={{
              padding: '10px 18px',
              border: '1px solid #E5D5B3',
              borderRadius: '20px',
              backgroundColor: statusFilter === tab.id ? '#6B1D2F' : '#FFFFFF',
              color: statusFilter === tab.id ? '#FFFFFF' : '#767676',
              fontSize: '13px',
              fontWeight: 500,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s ease',
              boxShadow: statusFilter === tab.id ? '0 4px 10px rgba(107, 29, 47, 0.15)' : 'none'
            }}
          >
            <span>{tab.label}</span>
            <span style={{
              backgroundColor: statusFilter === tab.id ? 'rgba(255,255,255,0.2)' : '#FAF8F3',
              color: statusFilter === tab.id ? '#FFFFFF' : '#6B1D2F',
              fontSize: '11px',
              padding: '2px 7px',
              borderRadius: '10px',
              fontWeight: 600
            }}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* 2. Search Bar Header */}
      <div style={{
        display: 'flex',
        gap: '15px',
        backgroundColor: '#FFFFFF',
        border: '1px solid #E5D5B3',
        borderRadius: '8px',
        padding: '16px 20px',
        alignItems: 'center',
        boxShadow: '0 4px 15px rgba(0,0,0,0.01)'
      }}>
        <Search size={18} style={{ color: '#767676' }} />
        <input 
          type="text"
          placeholder="Search by Tracking ID, Customer name, Country or City..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            border: 'none',
            fontSize: '14px',
            width: '100%',
            color: '#1C1C1C',
            outline: 'none'
          }}
        />
      </div>

      {/* 3. Orders Data List */}
      <div style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #E5D5B3',
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: '#FAF8F3', borderBottom: '2px solid #E5D5B3', color: '#767676', textTransform: 'uppercase', fontWeight: 600 }}>
                <th style={{ padding: '16px 20px' }}>Order Details</th>
                <th style={{ padding: '16px 20px' }}>Client</th>
                <th style={{ padding: '16px 20px', textAlign: 'center' }}>Total Amount</th>
                <th style={{ padding: '16px 20px', textAlign: 'center' }}>Status Badge</th>
                <th style={{ padding: '16px 20px' }}>Dispatch Management</th>
                <th style={{ padding: '16px 20px', textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ padding: '40px', textAnchor: 'middle', textAlign: 'center', color: '#767676' }}>
                    No orders match your criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map(order => {
                  const badge = getStatusStyle(order.shippingStatus);
                  return (
                    <tr 
                      key={order._id} 
                      style={{ 
                        borderBottom: '1px solid #FAF8F3', 
                        transition: 'background-color 0.2s' 
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FCFBF7'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      {/* Tracking ID / Date */}
                      <td style={{ padding: '18px 20px' }}>
                        <span style={{ fontWeight: 600, color: '#6B1D2F', display: 'block', fontSize: '14px' }}>
                          {order.trackingNumber}
                        </span>
                        <span style={{ display: 'block', fontSize: '11px', color: '#767676', marginTop: '4px' }}>
                          📅 {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                      </td>

                      {/* Client Info */}
                      <td style={{ padding: '18px 20px' }}>
                        <span style={{ fontWeight: 500, color: '#1C1C1C', display: 'block' }}>
                          {order.shippingAddress?.name || 'Guest Client'}
                        </span>
                        <span style={{ display: 'block', fontSize: '11.5px', color: '#767676', marginTop: '3px' }}>
                          📍 {order.shippingAddress?.city}, {order.shippingAddress?.country}
                        </span>
                      </td>

                      {/* Price */}
                      <td style={{ padding: '18px 20px', textAlign: 'center', fontWeight: 700, color: '#6B1D2F', fontSize: '14px' }}>
                        {formatPrice(order.totalAmount)}
                      </td>

                      {/* Status badge */}
                      <td style={{ padding: '18px 20px', textAlign: 'center' }}>
                        <span style={{
                          backgroundColor: badge.bg,
                          color: badge.color,
                          padding: '6px 12px',
                          borderRadius: '12px',
                          fontSize: '11px',
                          fontWeight: 600,
                          display: 'inline-block',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px'
                        }}>
                          {badge.label}
                        </span>
                      </td>

                      {/* Shipping status selector */}
                      <td style={{ padding: '18px 20px' }}>
                        <select 
                          value={order.shippingStatus}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          style={{
                            padding: '8px 12px',
                            border: '1px solid #E5D5B3',
                            borderRadius: '4px',
                            backgroundColor: '#FFFFFF',
                            fontSize: '12px',
                            cursor: 'pointer',
                            fontWeight: 500,
                            color: '#1C1C1C',
                            width: '160px'
                          }}
                        >
                          <option value="Ordered">Ordered</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Out for Delivery">Out for Delivery</option>
                          <option value="Delivered">Delivered</option>
                        </select>
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '18px 20px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                          <button
                            onClick={() => setSelectedOrder(order)}
                            title="Inspect Order Items"
                            style={{
                              backgroundColor: '#FAF8F3',
                              border: '1px solid #E5D5B3',
                              color: '#6B1D2F',
                              padding: '6px 10px',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#6B1D2F'; e.currentTarget.style.color = '#FFFFFF'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#FAF8F3'; e.currentTarget.style.color = '#6B1D2F'; }}
                          >
                            <Eye size={15} />
                          </button>
                          <button
                            onClick={() => handlePrint(order)}
                            title="Print Invoice Receipt"
                            style={{
                              backgroundColor: '#FAF8F3',
                              border: '1px solid #E5D5B3',
                              color: '#D4AF37',
                              padding: '6px 10px',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#D4AF37'; e.currentTarget.style.color = '#FFFFFF'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#FAF8F3'; e.currentTarget.style.color = '#D4AF37'; }}
                          >
                            <Printer size={15} />
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Interactive Details Modal Drawer overlay */}
      {selectedOrder && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          zIndex: 9999,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          animation: 'fadeIn 0.3s ease'
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '8px',
            border: '1px solid #E5D5B3',
            width: '100%',
            maxWidth: '650px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            maxHeight: '85vh',
            animation: 'scaleIn 0.3s ease'
          }}>
            {/* Modal Header */}
            <div style={{
              backgroundColor: '#FAF8F3',
              borderBottom: '1px solid #E5D5B3',
              padding: '20px 24px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', color: '#D4AF37', fontWeight: 600 }}>Order Audit Details</span>
                <h4 style={{ color: '#6B1D2F', fontSize: '16px', fontWeight: 600, marginTop: '4px' }}>
                  {selectedOrder.trackingNumber}
                </h4>
              </div>
              <button 
                onClick={() => setSelectedOrder(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#767676' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Delivery Track & Basic details */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', backgroundColor: '#FAF8F3', padding: '16px', borderRadius: '6px', border: '1px solid #FAF8F3' }}>
                <div>
                  <strong style={{ display: 'block', fontSize: '12px', color: '#767676', textTransform: 'uppercase' }}>Recipient Profile</strong>
                  <span style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1C1C1C', marginTop: '4px' }}>
                    {selectedOrder.shippingAddress?.name || 'Guest Client'}
                  </span>
                  <span style={{ display: 'block', fontSize: '12px', color: '#767676', marginTop: '2px' }}>
                    ✉️ {selectedOrder.shippingAddress?.email || selectedOrder.guestDetails?.email || 'No email provided'}
                  </span>
                  <span style={{ display: 'block', fontSize: '12px', color: '#767676' }}>
                    📞 {selectedOrder.shippingAddress?.phone || selectedOrder.guestDetails?.phone || 'No phone'}
                  </span>
                </div>
                <div>
                  <strong style={{ display: 'block', fontSize: '12px', color: '#767676', textTransform: 'uppercase' }}>Delivery Destination</strong>
                  <span style={{ display: 'block', fontSize: '12px', color: '#1C1C1C', marginTop: '4px', lineHeight: 1.4 }}>
                    {selectedOrder.shippingAddress?.addressLine || 'N/A'}<br/>
                    {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state || ''} - {selectedOrder.shippingAddress?.zipCode || ''}<br/>
                    <strong>Country:</strong> {selectedOrder.shippingAddress?.country || 'N/A'}
                  </span>
                </div>
              </div>

              {/* Items List */}
              <div>
                <h5 style={{ color: '#6B1D2F', fontSize: '13px', fontWeight: 600, borderBottom: '1px solid #FAF8F3', paddingBottom: '8px', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Ordered Items ({selectedOrder.items.reduce((sum, item) => sum + item.quantity, 0)} Items)
                </h5>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {selectedOrder.items.map((item, idx) => (
                    <div 
                      key={idx} 
                      style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        border: '1px solid #FAF8F3',
                        padding: '12px',
                        borderRadius: '4px',
                        fontSize: '13px'
                      }}
                    >
                      <div>
                        <strong style={{ color: '#1C1C1C' }}>{item.productName || item.product?.name || 'Premium Handcrafted Item'}</strong>
                        <span style={{ display: 'block', fontSize: '11px', color: '#767676', marginTop: '2px' }}>
                          Qty: <strong>{item.quantity}</strong> × {formatPrice(item.price)}
                        </span>
                      </div>
                      <div style={{ fontWeight: 600, color: '#6B1D2F' }}>
                        {formatPrice(item.price * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Summary */}
              <div style={{ borderTop: '1px solid #FAF8F3', paddingTop: '15px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#767676', marginBottom: '6px' }}>
                  <span>Gross Subtotal</span>
                  <span>{formatPrice(selectedOrder.items.reduce((sum, item) => sum + (item.price * item.quantity), 0))}</span>
                </div>
                {selectedOrder.couponApplied && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#059669', marginBottom: '6px', fontWeight: 500 }}>
                    <span>Promo Coupon ({selectedOrder.couponApplied.code})</span>
                    <span>Applied</span>
                  </div>
                )}
                {selectedOrder.loyaltyPointsDeducted > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#B45309', marginBottom: '6px', fontWeight: 500 }}>
                    <span>Loyalty Points Redeemed</span>
                    <span>-{selectedOrder.loyaltyPointsDeducted} pts</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px', fontWeight: 700, color: '#6B1D2F', borderTop: '1px double #E5D5B3', paddingTop: '10px' }}>
                  <span>Net Paid Amount</span>
                  <span>{formatPrice(selectedOrder.totalAmount)}</span>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div style={{
              backgroundColor: '#FAF8F3',
              borderTop: '1px solid #E5D5B3',
              padding: '16px 24px',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '12px'
            }}>
              <button 
                onClick={() => handlePrint(selectedOrder)}
                className="btn btn-outline"
                style={{ padding: '8px 16px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Printer size={14} /> Print Receipt
              </button>
              <button 
                onClick={() => setSelectedOrder(null)}
                className="btn btn-primary"
                style={{ padding: '8px 16px', fontSize: '12px' }}
              >
                Close View
              </button>
            </div>

          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>

    </div>
  );
};

export default Orders;
