import React, { useState } from 'react';
import {
  Bell,
  FolderSync,
  Compass,
  ServerCrash,
  ShieldAlert,
  CheckCheck,
  CheckCircle2,
  Inbox
} from 'lucide-react';
import EmptyState from '../../components/common/EmptyState';

const notificationCategories = [
  { id: 'all', label: 'All Dispatches', icon: Bell },
  { id: 'case_updates', label: 'Case Updates', icon: FolderSync },
  { id: 'investigation_updates', label: 'Investigation Updates', icon: Compass },
  { id: 'system_alerts', label: 'System Alerts', icon: ServerCrash },
  { id: 'security_alerts', label: 'Security Alerts', icon: ShieldAlert },
];

const NotificationsPage = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [markedRead, setMarkedRead] = useState(false);

  const handleMarkAllRead = () => {
    setMarkedRead(true);
    setTimeout(() => setMarkedRead(false), 3000);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>
              Notifications & Dispatches
            </h2>
            <span className="badge badge-blue">Real-Time Dispatch</span>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
            High-priority operational transmissions, investigation milestones, and security warnings
          </p>
        </div>

        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={handleMarkAllRead}
        >
          <CheckCheck size={16} />
          Mark All As Read
        </button>
      </div>

      {/* Categories Tabs */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        overflowX: 'auto',
        borderBottom: '1px solid var(--color-border)',
        paddingBottom: '0.5rem'
      }}>
        {notificationCategories.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '0.625rem 1rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: isActive ? 'rgba(0, 180, 216, 0.15)' : 'transparent',
                border: isActive ? '1px solid var(--color-primary)' : '1px solid transparent',
                color: isActive ? '#FFFFFF' : 'var(--color-text-secondary)',
                fontWeight: isActive ? 600 : 400,
                fontSize: '0.84rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                whiteSpace: 'nowrap'
              }}
            >
              <Icon size={16} color={isActive ? 'var(--color-primary)' : 'var(--color-text-muted)'} />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {markedRead && (
        <div style={{
          padding: '0.75rem 1rem',
          backgroundColor: 'rgba(16, 185, 129, 0.12)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          borderRadius: 'var(--radius-md)',
          color: 'var(--color-accent-success)',
          fontSize: '0.8125rem',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <CheckCircle2 size={16} />
          <span>All operational alerts marked as acknowledged.</span>
        </div>
      )}

      {/* Notification Body with "No new notifications." */}
      <div className="card">
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingBottom: '1rem',
          borderBottom: '1px solid var(--color-border)',
          marginBottom: '1rem'
        }}>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 600 }}>
              {notificationCategories.find(c => c.id === activeCategory)?.label}
            </h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
              Secure socket streaming channel: Active
            </span>
          </div>
          <span className="badge badge-gray">0 Unread</span>
        </div>

        <EmptyState
          icon={Inbox}
          title="No new notifications."
          description={`Your operational feed has no pending alerts for ${notificationCategories.find(c => c.id === activeCategory)?.label.toLowerCase()}. Critical security warnings and automated case updates will appear here in real-time.`}
          badgeText="All Clear"
        />
      </div>
    </div>
  );
};

export default NotificationsPage;
