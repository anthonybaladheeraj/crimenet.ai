import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Menu,
  Search,
  Bell,
  User,
  Shield,
  LogOut,
  ChevronDown,
  CheckCircle,
  ExternalLink
} from 'lucide-react';

const titleMap = {
  '/dashboard': 'Dashboard Overview',
  '/dashboard/search': 'Global Case & Suspect Search',
  '/dashboard/active-cases': 'Active Case Registry',
  '/dashboard/active-cases/new': 'Add New Case',
  '/dashboard/active-cases/update': 'Update Case Record',
  '/dashboard/solved-cases': 'Solved Cases Archive',
  '/dashboard/fir-records': 'FIR Central Repository',
  '/dashboard/suspect-details': 'Authorized Suspect Intelligence',
  '/dashboard/settings': 'System & Officer Preferences'
};

const TopNavbar = ({ onOpenSidebar }) => {
  const { officerId, openLogoutModal } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifyMenu, setShowNotifyMenu] = useState(false);

  const currentTitle = titleMap[location.pathname] || 'Dashboard';

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/dashboard/search?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/dashboard/search');
    }
  };

  return (
    <header style={{
      height: 'var(--navbar-height)',
      backgroundColor: 'rgba(12, 22, 56, 0.85)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid var(--color-border)',
      position: 'sticky',
      top: 0,
      zIndex: 900,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 1.75rem',
      gap: '1rem'
    }}>
      {/* Left side: Mobile menu & Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button
          type="button"
          onClick={onOpenSidebar}
          className="mobile-hamburger"
          style={{
            background: 'none',
            border: '1px solid var(--color-border)',
            borderRadius: '6px',
            color: 'var(--color-text-primary)',
            padding: '6px',
            cursor: 'pointer',
            display: 'none',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Menu size={20} />
        </button>

        <div>
          <h1 style={{
            fontSize: '1.15rem',
            fontWeight: 700,
            color: 'var(--color-text-primary)',
            lineHeight: 1.2
          }}>
            {currentTitle}
          </h1>
          <div style={{
            fontSize: '0.72rem',
            color: 'var(--color-text-muted)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <span>Portal</span>
            <span>/</span>
            <span style={{ color: 'var(--color-primary)' }}>{currentTitle}</span>
          </div>
        </div>
      </div>

      {/* Middle: Quick Search Input */}
      <form 
        onSubmit={handleSearchSubmit}
        style={{
          flex: 1,
          maxWidth: '440px',
          display: 'flex',
          alignItems: 'center'
        }}
        className="nav-search-form"
      >
        <div style={{ position: 'relative', width: '100%' }}>
          <Search 
            size={16} 
            style={{ 
              position: 'absolute', 
              left: '0.875rem', 
              top: '50%', 
              transform: 'translateY(-50%)', 
              color: 'var(--color-text-muted)' 
            }} 
          />
          <input
            type="text"
            className="form-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Global search cases, FIRs, suspects..."
            style={{
              paddingLeft: '2.5rem',
              paddingRight: '4rem',
              height: '38px',
              fontSize: '0.8125rem',
              backgroundColor: 'rgba(8, 17, 45, 0.6)'
            }}
          />
          <button
            type="submit"
            style={{
              position: 'absolute',
              right: '6px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'rgba(0, 180, 216, 0.15)',
              border: '1px solid rgba(0, 180, 216, 0.3)',
              borderRadius: '4px',
              color: 'var(--color-primary)',
              fontSize: '0.7rem',
              fontWeight: 600,
              padding: '3px 8px',
              cursor: 'pointer'
            }}
          >
            SEARCH
          </button>
        </div>
      </form>

      {/* Right side: Notifications & Officer Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {/* Notifications Icon with popover */}
        <div style={{ position: 'relative' }}>
          <button
            type="button"
            onClick={() => setShowNotifyMenu(!showNotifyMenu)}
            style={{
              background: showNotifyMenu ? 'rgba(30, 45, 90, 0.7)' : 'rgba(17, 30, 72, 0.6)',
              border: '1px solid var(--color-border)',
              borderRadius: '8px',
              width: '38px',
              height: '38px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-text-secondary)',
              cursor: 'pointer',
              position: 'relative'
            }}
            title="Notifications"
          >
            <Bell size={18} />
            <span style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-primary)',
              boxShadow: '0 0 6px var(--color-primary)'
            }} />
          </button>

          {/* Dropdown */}
          {showNotifyMenu && (
            <div 
              className="animate-fade-in"
              style={{
                position: 'absolute',
                right: 0,
                top: '46px',
                width: '300px',
                backgroundColor: 'var(--color-bg-card)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-lg)',
                padding: '1rem',
                zIndex: 1000
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingBottom: '0.75rem',
                borderBottom: '1px solid var(--color-border)',
                marginBottom: '0.75rem'
              }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>System Notifications</span>
                <span className="badge badge-gray" style={{ fontSize: '0.65rem' }}>0 unread</span>
              </div>
              <div style={{
                padding: '1.25rem 0.5rem',
                textAlign: 'center',
                color: 'var(--color-text-secondary)',
                fontSize: '0.8125rem'
              }}>
                No new notifications.
              </div>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                style={{ width: '100%', marginTop: '0.5rem', fontSize: '0.75rem' }}
                onClick={() => {
                  setShowNotifyMenu(false);
                  navigate('/dashboard/notifications');
                }}
              >
                View Dispatch Center
              </button>
            </div>
          )}
        </div>

        {/* Officer Profile Pill */}
        <div style={{ position: 'relative' }}>
          <div
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '4px 10px 4px 6px',
              background: 'rgba(17, 30, 72, 0.6)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-full)',
              cursor: 'pointer',
              userSelect: 'none'
            }}
          >
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: 'rgba(0, 180, 216, 0.2)',
              border: '1px solid rgba(0, 180, 216, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-primary)'
            }}>
              <User size={16} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-primary)', letterSpacing: '0.03em' }}>
                {officerId}
              </span>
              <span style={{ fontSize: '0.65rem', color: 'var(--color-accent-gold)', fontWeight: 500 }}>
                Law Enforcement Officer
              </span>
            </div>

            <ChevronDown size={14} color="var(--color-text-muted)" />
          </div>

          {/* Profile Dropdown */}
          {showProfileMenu && (
            <div
              className="animate-fade-in"
              style={{
                position: 'absolute',
                right: 0,
                top: '46px',
                width: '240px',
                backgroundColor: 'var(--color-bg-card)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-lg)',
                padding: '0.75rem',
                zIndex: 1000
              }}
            >
              <div style={{
                padding: '0.5rem',
                borderBottom: '1px solid var(--color-border)',
                marginBottom: '0.5rem'
              }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>Authorized Portal User</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>ID: {officerId}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--color-accent-success)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <CheckCircle size={12} /> 2FA Verified (Active)
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowProfileMenu(false);
                  navigate('/dashboard/settings');
                }}
                style={{
                  width: '100%',
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-text-secondary)',
                  padding: '0.5rem',
                  borderRadius: '4px',
                  textAlign: 'left',
                  fontSize: '0.8125rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <Shield size={14} />
                Security Settings
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowProfileMenu(false);
                  openLogoutModal();
                }}
                style={{
                  width: '100%',
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-accent-danger)',
                  padding: '0.5rem',
                  borderRadius: '4px',
                  textAlign: 'left',
                  fontSize: '0.8125rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginTop: '4px'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.1)'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <LogOut size={14} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopNavbar;
