import React, { useState } from 'react';
import { Search, Users, Award, ShieldAlert, CheckCircle2 } from 'lucide-react';

const Customers = ({ usersList }) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter customers by name or email
  const filteredUsers = usersList.filter(u => {
    const term = searchQuery.toLowerCase();
    return (
      (u.name && u.name.toLowerCase().includes(term)) ||
      (u.email && u.email.toLowerCase().includes(term)) ||
      (u.role && u.role.toLowerCase().includes(term))
    );
  });

  // Generates initials from names for premium avatars
  const getUserInitials = (name) => {
    if (!name) return 'U';
    const split = name.split(' ');
    if (split.length > 1) {
      return (split[0][0] + split[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  // Pre-selected avatar colors
  const avatarColors = [
    { bg: '#FAF0F2', border: '#D4B2BA', color: '#6B1D2F' },
    { bg: '#F0F7FA', border: '#B2CBD4', color: '#1B4A5C' },
    { bg: '#F6FAF0', border: '#CCD4B2', color: '#445C1B' },
    { bg: '#FAF6F0', border: '#D4C4B2', color: '#5C3A1B' },
    { bg: '#F8F0FA', border: '#CBB2D4', color: '#4F1B5C' }
  ];

  const getAvatarStyle = (index) => {
    return avatarColors[index % avatarColors.length];
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
      
      {/* 1. Header Metrics Banner */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        border: '1px solid #E5D5B3',
        borderRadius: '8px',
        padding: '20px 24px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.01)'
      }}>
        <div>
          <h4 style={{ color: '#6B1D2F', fontSize: '18px', fontWeight: 600 }}>Customers Directory</h4>
          <span style={{ fontSize: '12px', color: '#767676' }}>List of all registered shoppers and administration logs</span>
        </div>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <span style={{ fontSize: '13px', color: '#767676', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Users size={16} style={{ color: '#D4AF37' }} />
            Total Accounts: <strong>{usersList.length}</strong>
          </span>
        </div>
      </div>

      {/* 2. Live Search bar */}
      <div style={{
        display: 'flex',
        gap: '12px',
        backgroundColor: '#FFFFFF',
        border: '1px solid #E5D5B3',
        borderRadius: '8px',
        padding: '12px 20px',
        alignItems: 'center',
        boxShadow: '0 4px 15px rgba(0,0,0,0.01)'
      }}>
        <Search size={18} style={{ color: '#767676' }} />
        <input 
          type="text"
          placeholder="Filter customers by username or email address..."
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

      {/* 3. Customers Grid / Table */}
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
                <th style={{ padding: '16px 24px', width: '260px' }}>Customer Profile</th>
                <th style={{ padding: '16px 24px' }}>Email Address</th>
                <th style={{ padding: '16px 24px', textAlign: 'center', width: '140px' }}>System Access Role</th>
                <th style={{ padding: '16px 24px', textAlign: 'center', width: '180px' }}>Loyalty Point Balance</th>
                <th style={{ padding: '16px 24px', textAlign: 'center', width: '160px' }}>Joined Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: '#767676' }}>
                    No customers match your search query.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user, idx) => {
                  const avatar = getAvatarStyle(idx);
                  return (
                    <tr 
                      key={user._id} 
                      style={{ 
                        borderBottom: '1px solid #FAF8F3', 
                        transition: 'background-color 0.2s' 
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FCFBF7'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      {/* Avatar & Name */}
                      <td style={{ padding: '16px 24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                          <div style={{
                            width: '38px',
                            height: '38px',
                            borderRadius: '50%',
                            backgroundColor: avatar.bg,
                            border: `1.5px solid ${avatar.border}`,
                            color: avatar.color,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                            fontSize: '13px'
                          }}>
                            {getUserInitials(user.name)}
                          </div>
                          <span style={{ fontWeight: 600, color: '#1C1C1C', fontSize: '13.5px' }}>
                            {user.name}
                          </span>
                        </div>
                      </td>

                      {/* Email Address */}
                      <td style={{ padding: '16px 24px', color: '#1C1C1C' }}>
                        {user.email}
                      </td>

                      {/* Role Pill */}
                      <td style={{ padding: '16px 24px', textAlign: 'center' }}>
                        <span style={{
                          backgroundColor: user.role === 'admin' ? '#FAF0F2' : '#F6FAF0',
                          color: user.role === 'admin' ? '#6B1D2F' : '#445C1B',
                          fontWeight: 600,
                          padding: '4px 10px',
                          border: user.role === 'admin' ? '1px solid #D4B2BA' : '1px solid #CCD4B2',
                          borderRadius: '4px',
                          fontSize: '11px',
                          letterSpacing: '0.5px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          textTransform: 'uppercase'
                        }}>
                          {user.role === 'admin' ? (
                            <>🛡️ Admin</>
                          ) : (
                            <>👤 Client</>
                          )}
                        </span>
                      </td>

                      {/* Loyalty reward points balance */}
                      <td style={{ padding: '16px 24px', textAlign: 'center' }}>
                        <span style={{ 
                          fontWeight: 700, 
                          color: '#6B1D2F', 
                          fontSize: '14px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}>
                          <Award size={16} style={{ color: '#D4AF37' }} />
                          {user.rewardPoints || 0} pts
                        </span>
                      </td>

                      {/* Created date */}
                      <td style={{ padding: '16px 24px', textAlign: 'center', color: '#767676' }}>
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Verified Member'}
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default Customers;
