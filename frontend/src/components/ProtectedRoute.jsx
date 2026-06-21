import React from 'react';
import { Navigate } from 'react-router-dom';
import { useApp } from '../context/AppState';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, authLoading } = useApp();

  if (authLoading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '300px' }}>
        <div style={{
          width: '30px',
          height: '30px',
          border: '3px solid #E5D5B3',
          borderTopColor: '#6B1D2F',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <p style={{ marginTop: '15px', color: '#767676', fontSize: '13px' }}>Authorizing security access...</p>
        
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // If user is not logged in, redirect to login/register page
  if (!user) {
    return <Navigate to="/profile" replace />;
  }

  // If route is restricted to admins only and user is standard customer
  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/profile" replace />;
  }

  return children;
};

export default ProtectedRoute;
