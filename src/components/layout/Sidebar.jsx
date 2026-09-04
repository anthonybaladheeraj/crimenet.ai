import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Search,
  FolderLock,
  CheckCircle2,
  FileText,
  UserCheck,
  Share2,
  FileSpreadsheet,
  Bell,
  Settings,
  LogOut,
  Shield,
  Radio,
  X
} from 'lucide-react';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { path: '/dashboard/active-cases', label: 'Active Cases', icon: FolderLock },
  { path: '/dashboard/solved-cases', label: 'Solved Cases', icon: CheckCircle2 },
  { path: '/dashboard/fir-records', label: 'FIR Records', icon: FileText },
  { path: '/dashboard/suspect-details', label: 'Suspect Details', icon: UserCheck },
  { path: '/dashboard/settings', label: 'Settings', icon: Settings },
];

const Sidebar = ({ isOpen, onClose }) => {
  const { openLogoutModal } = useAuth();

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(5, 10, 25, 0.7)',
            backdropFilter: 'blur(3px)',
            zIndex: 998,
            display: 'block'
          }}
        />
      )}

      <aside style={{
        width: 'var(--sidebar-width)',
        backgroundColor: 'var(--color-bg-secondary)',
        borderRight: '1px solid var(--color-border)',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: 0,
        bottom: 0,
        left: 0,
        zIndex: 999,
        transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        transform: isOpen ? 'translateX(0)' : 'none',
      }} className="sidebar-container">
        {/* Brand / Logo Section */}
        <div style={{
          padding: '1.25rem 1.25rem 1.25rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid var(--color-border)',
          background: 'rgba(8, 17, 45, 0.5)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, rgba(0, 180, 216, 0.2) 0%, rgba(30, 45, 90, 0.8) 100%)',
              border: '1px solid rgba(0, 180, 216, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 12px rgba(0, 180, 216, 0.2)'
            }}>
              <Shield size={22} color="#00B4D8" />
            </div>
            <div>
              <div style={{
                fontSize: '1.05rem',
                fontWeight: 800,
                letterSpacing: '0.05em',
                color: 'var(--color-text-primary)',
                lineHeight: 1.2
              }}>
                CRIMENET<span style={{ color: 'var(--color-primary)' }}>.AI</span>
              </div>
              <div style={{
                fontSize: '0.6875rem',
                color: 'var(--color-accent-gold)',
                fontWeight: 600,
                letterSpacing: '0.06em',
                textTransform: 'uppercase'
              }}>
                Law Enforcement Portal
              </div>
            </div>
          </div>

          {/* Close for mobile */}
          <button 
            onClick={onClose}
            className="mobile-only-btn"
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-text-muted)',
              cursor: 'pointer',
              display: 'none',
              padding: '4px'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* System status pill */}
        <div style={{
          padding: '0.75rem 1.25rem',
          borderBottom: '1px solid rgba(30, 45, 90, 0.4)',
          backgroundColor: 'rgba(7, 15, 43, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
            <span style={{ position: 'relative', display: 'flex', width: '8px', height: '8px' }}>
              <span style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                backgroundColor: 'var(--color-accent-success)',
                opacity: 0.75
              }} className="pulse-radar" />
              <span style={{
                position: 'relative',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-accent-success)'
              }} />
            </span>
            <span>SECURE TERMINAL</span>
          </div>
          <span className="badge badge-gold" style={{ fontSize: '0.625rem', padding: '2px 6px' }}>
            SIH PROTOTYPE
          </span>
        </div>

        {/* Navigation list */}
        <nav style={{
          flex: 1,
          padding: '1rem 0.75rem',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px'
        }}>
          <div style={{
            fontSize: '0.6875rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            color: 'var(--color-text-dim)',
            padding: '0.35rem 0.75rem',
            letterSpacing: '0.08em'
          }}>
            Main Navigation
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.exact}
                onClick={onClose}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '0.625rem 0.875rem',
                  borderRadius: 'var(--radius-md)',
                  color: isActive ? '#FFFFFF' : 'var(--color-text-secondary)',
                  backgroundColor: isActive ? 'rgba(0, 180, 216, 0.14)' : 'transparent',
                  borderLeft: isActive ? '3px solid var(--color-primary)' : '3px solid transparent',
                  fontWeight: isActive ? 600 : 400,
                  fontSize: '0.84rem',
                  textDecoration: 'none',
                  transition: 'all 0.15s ease'
                })}
              >
                {({ isActive }) => (
                  <>
                    <Icon 
                      size={18} 
                      color={isActive ? 'var(--color-primary)' : 'var(--color-text-muted)'} 
                      strokeWidth={isActive ? 2.2 : 1.8}
                    />
                    <span style={{ flex: 1 }}>{item.label}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Sidebar Footer with Logout button */}
        <div style={{
          padding: '1rem',
          borderTop: '1px solid var(--color-border)',
          backgroundColor: 'rgba(7, 15, 43, 0.8)'
        }}>
          <button
            type="button"
            onClick={openLogoutModal}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '0.625rem 0.875rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              backgroundColor: 'rgba(239, 68, 68, 0.08)',
              color: '#F87171',
              fontSize: '0.84rem',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              textAlign: 'left'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.18)';
              e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.4)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.08)';
              e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.2)';
            }}
          >
            <LogOut size={18} />
            <span>Logout Session</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
