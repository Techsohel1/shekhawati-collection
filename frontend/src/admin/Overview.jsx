import React from 'react';
import { TrendingUp, ShoppingBag, Users, Layers, ArrowUpRight, Activity } from 'lucide-react';

const Overview = ({ stats, formatPrice, setTab }) => {
  // Mock data for the premium SVG Revenue Chart
  const chartData = [
    { month: 'Jan', revenue: 12000, x: 80, y: 220 },
    { month: 'Feb', revenue: 18500, x: 200, y: 180 },
    { month: 'Mar', revenue: 26000, x: 320, y: 130 },
    { month: 'Apr', revenue: 34000, x: 440, y: 90 },
    { month: 'May', revenue: 42000, x: 560, y: 60 },
    { month: 'Jun', revenue: stats.sales || 58450, x: 680, y: 30 }
  ];

  const maxRevenue = 60000;
  const gridLinesY = [50, 100, 150, 200, 250];

  const statCards = [
    {
      title: 'Total Revenue',
      value: formatPrice(stats.sales),
      change: '+18.4% this month',
      icon: <TrendingUp size={24} />,
      color: '#6B1D2F',
      tab: 'orders'
    },
    {
      title: 'Total Orders',
      value: stats.ordersCount,
      change: '+12.3% this week',
      icon: <ShoppingBag size={24} />,
      color: '#D4AF37',
      tab: 'orders'
    },
    {
      title: 'Active Customers',
      value: stats.customersCount,
      change: '+8.7% new signups',
      icon: <Users size={24} />,
      color: '#1E3A8A',
      tab: 'customers'
    },
    {
      title: 'Products in Catalog',
      value: stats.productsCount,
      change: '4 main collections',
      icon: <Layers size={24} />,
      color: '#10B981',
      tab: 'products'
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      
      {/* 1. Stat Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '24px'
      }}>
        {statCards.map((card, idx) => (
          <div
            key={idx}
            onClick={() => setTab(card.tab)}
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E5D5B3',
              borderRadius: '8px',
              padding: '24px',
              cursor: 'pointer',
              boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
              transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '140px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(107, 29, 47, 0.06)';
              e.currentTarget.style.borderColor = '#6B1D2F';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.02)';
              e.currentTarget.style.borderColor = '#E5D5B3';
            }}
          >
            {/* Top Row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span style={{ fontSize: '13px', color: '#767676', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  {card.title}
                </span>
                <h4 style={{ fontSize: '28px', color: '#1C1C1C', marginTop: '8px', fontFamily: 'var(--font-sans)', fontWeight: 700 }}>
                  {card.value}
                </h4>
              </div>
              <div style={{
                backgroundColor: `${card.color}12`,
                color: card.color,
                padding: '10px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {card.icon}
              </div>
            </div>

            {/* Bottom Row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '15px', borderTop: '1px solid #FAF8F3', paddingTop: '12px' }}>
              <span style={{ color: '#10B981', display: 'flex', alignItems: 'center', fontSize: '12px', fontWeight: 600 }}>
                <ArrowUpRight size={14} style={{ marginRight: '2px' }} />
                {card.change}
              </span>
            </div>

            {/* Decorative Side Bar Indicator */}
            <div style={{
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: '4px',
              backgroundColor: card.color
            }}></div>
          </div>
        ))}
      </div>

      {/* 2. Graphical Analytics Section */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: '30px',
        alignItems: 'stretch'
      }}>
        {/* SVG Sales Trend Chart */}
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #E5D5B3',
          borderRadius: '8px',
          padding: '28px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div>
              <h4 style={{ color: '#6B1D2F', fontSize: '18px', fontWeight: 600 }}>Revenue Analytics</h4>
              <span style={{ fontSize: '12px', color: '#767676' }}>Monthly global sales distribution in real-time</span>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#767676', border: '1px solid #FAF8F3', padding: '4px 10px', borderRadius: '4px' }}>
                <span style={{ width: '8px', height: '8px', backgroundColor: '#D4AF37', borderRadius: '50%', display: 'inline-block' }}></span>
                Revenue Curve
              </span>
            </div>
          </div>

          {/* Premium Vector SVG Chart */}
          <div style={{ position: 'relative', width: '100%' }}>
            <svg viewBox="0 0 740 280" style={{ width: '100%', height: 'auto', overflow: 'visible' }}>
              {/* Grid Lines */}
              {gridLinesY.map((yVal, i) => (
                <g key={i}>
                  <line 
                    x1="50" 
                    y1={yVal} 
                    x2="720" 
                    y2={yVal} 
                    stroke="#F0EDE4" 
                    strokeWidth="1" 
                    strokeDasharray="4 4" 
                  />
                  <text 
                    x="40" 
                    y={yVal + 4} 
                    fill="#9A9A9A" 
                    fontSize="10" 
                    textAnchor="end" 
                    fontFamily="monospace"
                  >
                    {formatPrice(maxRevenue - (yVal / 280) * maxRevenue).split('.')[0]}
                  </text>
                </g>
              ))}

              {/* Bottom Border Axis */}
              <line x1="50" y1="250" x2="720" y2="250" stroke="#E5D5B3" strokeWidth="1" />

              {/* X Axis Labels */}
              {chartData.map((d, i) => (
                <text 
                  key={i} 
                  x={d.x} 
                  y="270" 
                  fill="#767676" 
                  fontSize="11" 
                  textAnchor="middle" 
                  fontWeight="500"
                >
                  {d.month}
                </text>
              ))}

              {/* Area Under Path Gradient Def */}
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="strokeGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#6B1D2F" />
                  <stop offset="50%" stopColor="#D4AF37" />
                  <stop offset="100%" stopColor="#6B1D2F" />
                </linearGradient>
              </defs>

              {/* Gradient Area Fill */}
              <path 
                d={`M ${chartData[0].x} 250 L ${chartData[0].x} ${chartData[0].y} 
                    ${chartData.map((d, i) => i > 0 ? `L ${d.x} ${d.y}` : '').join(' ')} 
                    L ${chartData[chartData.length - 1].x} 250 Z`}
                fill="url(#chartGradient)"
              />

              {/* Smooth Trend Line */}
              <path 
                d={`M ${chartData[0].x} ${chartData[0].y} 
                    ${chartData.map((d, i) => i > 0 ? `L ${d.x} ${d.y}` : '').join(' ')}`}
                fill="none"
                stroke="url(#strokeGradient)"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Node Circles */}
              {chartData.map((d, i) => (
                <g key={i} className="chart-node" style={{ cursor: 'pointer' }}>
                  <circle 
                    cx={d.x} 
                    cy={d.y} 
                    r="8" 
                    fill="#FFFFFF" 
                    stroke="#6B1D2F" 
                    strokeWidth="2.5" 
                    style={{ transition: 'all 0.2s' }}
                  />
                  <circle 
                    cx={d.x} 
                    cy={d.y} 
                    r="4" 
                    fill="#D4AF37" 
                  />
                  
                  {/* Tooltip Overlay (renders when hovering node) */}
                  <g className="tooltip" style={{ opacity: 0.9 }}>
                    <rect 
                      x={d.x - 45} 
                      y={d.y - 45} 
                      width="90" 
                      height="26" 
                      rx="4" 
                      fill="#1C1C1C" 
                    />
                    <text 
                      x={d.x} 
                      y={d.y - 28} 
                      fill="#FFFFFF" 
                      fontSize="10" 
                      fontWeight="bold" 
                      textAnchor="middle"
                    >
                      {formatPrice(d.revenue).split('.')[0]}
                    </text>
                  </g>
                </g>
              ))}
            </svg>
            
            <style>{`
              .chart-node:hover circle:first-of-type {
                r: 11;
                stroke: #D4AF37;
              }
              .chart-node .tooltip {
                visibility: hidden;
                transition: opacity 0.2s;
              }
              .chart-node:hover .tooltip {
                visibility: visible;
              }
            `}</style>
          </div>
        </div>

        {/* Store Performance Insights */}
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #E5D5B3',
          borderRadius: '8px',
          padding: '28px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <h4 style={{ color: '#6B1D2F', fontSize: '18px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
              <Activity size={20} style={{ color: '#D4AF37' }} /> Royal Audit Logs
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '16px', marginTop: '2px' }}>🔒</span>
                <div>
                  <strong style={{ display: 'block', fontSize: '13px', color: '#1C1C1C' }}>Cloud Secure Database</strong>
                  <p style={{ fontSize: '12px', color: '#767676', marginTop: '2px' }}>Linked to Live MongoDB Atlas Cluster</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '16px', marginTop: '2px' }}>🛡️</span>
                <div>
                  <strong style={{ display: 'block', fontSize: '13px', color: '#1C1C1C' }}>JWT Security Session</strong>
                  <p style={{ fontSize: '12px', color: '#767676', marginTop: '2px' }}>Standard 256-bit token handshake</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '16px', marginTop: '2px' }}>✈️</span>
                <div>
                  <strong style={{ display: 'block', fontSize: '13px', color: '#1C1C1C' }}>Global Distribution</strong>
                  <p style={{ fontSize: '12px', color: '#767676', marginTop: '2px' }}>Shipping to USA, UK, EU, CA, and AU</p>
                </div>
              </div>
            </div>
          </div>

          <div style={{
            backgroundColor: '#FAF8F3',
            border: '1px solid #E5D5B3',
            padding: '16px',
            borderRadius: '6px',
            marginTop: '20px'
          }}>
            <h5 style={{ fontSize: '13px', color: '#6B1D2F', fontWeight: 600, marginBottom: '6px' }}>🔑 Quick Action Portal</h5>
            <p style={{ fontSize: '11.5px', color: '#767676', lineHeight: 1.4 }}>
              Click any sidebar option to update stock, dispatch orders, review profiles, or configure promo tickets.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Overview;
