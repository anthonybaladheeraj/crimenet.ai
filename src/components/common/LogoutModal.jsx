import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogOut, AlertTriangle, X } from 'lucide-react';

const LogoutModal = () => {
  const { isLogoutModalOpen, closeLogoutModal, logout } = useAuth();
  const navigate = useNavigate();

  if (!isLogoutModalOpen) return null;

  const handleConfirmLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(5, 10, 25, 0.8)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '1rem'
    }}>
      <div 
        className="animate-fade-in"
        style={{
          backgroundColor: 'var(--color-bg-card)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
          width: '100%',
          maxWidth: '420px',
          boxShadow: 'var(--shadow-lg)',
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--color-border)',
          background: 'rgba(8, 17, 45, 0.6)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: 'rgba(239, 68, 68, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <AlertTriangle size={20} color="var(--color-accent-danger)" />
            </div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
              Session Termination
            </h3>
          </div>
          <button 
            onClick={closeLogoutModal}
            style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '1.5rem' }}>
          <p style={{ fontSize: '0.95rem', color: 'var(--color-text-primary)', marginBottom: '0.5rem', fontWeight: 500 }}>
            Are you sure you want to logout?
          </p>
          <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
            Terminating your session will immediately clear your authorized encrypted workspace cache. You will need to re-authenticate with your Officer ID and OTP to regain access.
          </p>
        </div>

        {/* Footer Actions */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: '12px',
          padding: '1rem 1.5rem',
          borderTop: '1px solid var(--color-border)',
          background: 'rgba(8, 17, 45, 0.4)'
        }}>
          <button 
            type="button" 
            className="btn btn-secondary btn-sm"
            onClick={closeLogoutModal}
          >
            Cancel
          </button>
          <button 
            type="button" 
            className="btn btn-danger btn-sm"
            onClick={handleConfirmLogout}
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;
