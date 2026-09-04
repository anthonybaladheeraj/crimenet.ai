import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Settings,
  User,
  Shield,
  Bell,
  Sliders,
  LogOut,
  Lock,
  Key,
  Smartphone,
  Eye,
  CheckCircle2,
  Save,
  Laptop
} from 'lucide-react';
import BackButton from '../../components/common/BackButton';

const settingsTabs = [
  { id: 'profile', label: 'Officer Profile', icon: User },
  { id: 'security', label: 'Password & Security', icon: Shield },
  { id: 'notifications', label: 'Notification Preferences', icon: Bell },
  { id: 'system', label: 'System Preferences', icon: Sliders },
  { id: 'logout', label: 'Logout', icon: LogOut, isDanger: true },
];

const SettingsPage = () => {
  const { officerId, openLogoutModal } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');

  // Prototype preference states
  const [saveMessage, setSaveMessage] = useState(false);
  const [notifyCaseUpdates, setNotifyCaseUpdates] = useState(true);
  const [notifySecurityAlerts, setNotifySecurityAlerts] = useState(true);
  const [notifySystemHealth, setNotifySystemHealth] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState('30');
  const [graphRenderer, setGraphRenderer] = useState('webgl');

  const handleSavePreferences = (e) => {
    e.preventDefault();
    setSaveMessage(true);
    setTimeout(() => setSaveMessage(false), 3000);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header with Back Button */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <BackButton to="/dashboard" label="Back" />
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>
              Settings & Terminal Configuration
            </h2>
            <span className="badge badge-gray">Preferences</span>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
            Manage law-enforcement identity clearance, local terminal parameters, and dispatch notifications
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        overflowX: 'auto',
        borderBottom: '1px solid var(--color-border)',
        paddingBottom: '0.5rem'
      }}>
        {settingsTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          if (tab.id === 'logout') {
            return (
              <button
                key={tab.id}
                type="button"
                onClick={openLogoutModal}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '0.625rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'rgba(239, 68, 68, 0.08)',
                  border: '1px solid rgba(239, 68, 68, 0.25)',
                  color: '#F87171',
                  fontWeight: 500,
                  fontSize: '0.84rem',
                  cursor: 'pointer',
                  marginLeft: 'auto',
                  whiteSpace: 'nowrap'
                }}
              >
                <Icon size={16} />
                <span>Terminate Session</span>
              </button>
            );
          }

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
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
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {saveMessage && (
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
          <span>Configuration saved successfully to local station cache.</span>
        </div>
      )}

      {/* Tab 1: Officer Profile */}
      {activeTab === 'profile' && (
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.25rem' }}>
              Authorized Officer Dossier
            </h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>
              Service credentials associated with this authenticated terminal session
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1.25rem'
          }}>
            <div style={{
              padding: '1rem',
              backgroundColor: 'rgba(8, 17, 45, 0.6)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)'
            }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                Service Identification
              </span>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-accent-gold)', marginTop: '4px', fontFamily: 'var(--font-mono)' }}>
                {officerId}
              </div>
            </div>

            <div style={{
              padding: '1rem',
              backgroundColor: 'rgba(8, 17, 45, 0.6)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)'
            }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                Department Wing
              </span>
              <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-text-primary)', marginTop: '4px' }}>
                Special Cyber Crime Division
              </div>
            </div>

            <div style={{
              padding: '1rem',
              backgroundColor: 'rgba(8, 17, 45, 0.6)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)'
            }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                Security Clearance
              </span>
              <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-accent-success)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Shield size={16} /> Level 4 (Tactical & Analytics)
              </div>
            </div>

            <div style={{
              padding: '1rem',
              backgroundColor: 'rgba(8, 17, 45, 0.6)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)'
            }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                Terminal Hardware
              </span>
              <div style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--color-text-secondary)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Laptop size={15} /> Encrypted Law Enforcement Node
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Password & Security */}
      {activeTab === 'security' && (
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.25rem' }}>
              Security & Access Controls
            </h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>
              Two-factor verification settings and cryptographic session limits
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{
              padding: '1.25rem',
              backgroundColor: 'rgba(8, 17, 45, 0.6)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem'
            }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Smartphone size={16} color="var(--color-primary)" />
                  Two-Factor Authentication (OTP Gateway)
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                  Hardware token or registered device dispatch enforced on every login
                </div>
              </div>
              <span className="badge badge-green">Enforced (Active)</span>
            </div>

            <div style={{
              padding: '1.25rem',
              backgroundColor: 'rgba(8, 17, 45, 0.6)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem'
            }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Lock size={16} color="var(--color-accent-amber)" />
                  Inactivity Auto-Logout Timeout
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                  Automatically terminate terminal session upon idle detection
                </div>
              </div>
              <select
                className="form-input"
                value={sessionTimeout}
                onChange={(e) => setSessionTimeout(e.target.value)}
                style={{ width: '150px', height: '36px', fontSize: '0.8rem' }}
              >
                <option value="15">15 Minutes</option>
                <option value="30">30 Minutes</option>
                <option value="60">60 Minutes</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Notification Preferences */}
      {activeTab === 'notifications' && (
        <form onSubmit={handleSavePreferences} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.25rem' }}>
              Dispatch & Alert Preferences
            </h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>
              Configure event notifications delivered to your active terminal
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <label style={{
              padding: '1rem',
              backgroundColor: 'rgba(8, 17, 45, 0.6)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer'
            }}>
              <div>
                <div style={{ fontSize: '0.88rem', fontWeight: 600 }}>Case Investigation Updates</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                  Receive alerts when linked FIRs, forensics, or court orders are registered
                </div>
              </div>
              <input
                type="checkbox"
                checked={notifyCaseUpdates}
                onChange={(e) => setNotifyCaseUpdates(e.target.checked)}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
            </label>

            <label style={{
              padding: '1rem',
              backgroundColor: 'rgba(8, 17, 45, 0.6)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer'
            }}>
              <div>
                <div style={{ fontSize: '0.88rem', fontWeight: 600 }}>High-Priority Security Alerts</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                  Flash dispatches for syndicate movements, flight risk triggers, and urgent warrants
                </div>
              </div>
              <input
                type="checkbox"
                checked={notifySecurityAlerts}
                onChange={(e) => setNotifySecurityAlerts(e.target.checked)}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
            </label>

            <label style={{
              padding: '1rem',
              backgroundColor: 'rgba(8, 17, 45, 0.6)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer'
            }}>
              <div>
                <div style={{ fontSize: '0.88rem', fontWeight: 600 }}>System Maintenance & Audit Dispatches</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                  Database sync schedules, server heartbeat alerts, and key rotation reminders
                </div>
              </div>
              <input
                type="checkbox"
                checked={notifySystemHealth}
                onChange={(e) => setNotifySystemHealth(e.target.checked)}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
            </label>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" className="btn btn-primary btn-sm">
              <Save size={15} />
              Save Notification Preferences
            </button>
          </div>
        </form>
      )}

      {/* Tab 4: System Preferences */}
      {activeTab === 'system' && (
        <form onSubmit={handleSavePreferences} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.25rem' }}>
              System & Display Engine Preferences
            </h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>
              Hardware acceleration and rendering options for the graph visualization engine
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label className="form-label">
                Graph Visualizer Acceleration
              </label>
              <select
                className="form-input"
                value={graphRenderer}
                onChange={(e) => setGraphRenderer(e.target.value)}
                style={{ maxWidth: '400px' }}
              >
                <option value="webgl">Hardware WebGL (High Node Density, 10,000+ entities)</option>
                <option value="canvas">HTML5 2D Canvas (Balanced Efficiency)</option>
                <option value="svg">Vector SVG (High Precision Vector Printing)</option>
              </select>
            </div>

            <div style={{
              padding: '1rem',
              backgroundColor: 'rgba(8, 17, 45, 0.6)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ fontSize: '0.88rem', fontWeight: 600 }}>High-Contrast Dark Navy Scheme</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                  Calibrated for low-light command centers and high optical clarity
                </div>
              </div>
              <span className="badge badge-blue">Standard Enforced</span>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" className="btn btn-primary btn-sm">
              <Save size={15} />
              Apply System Preferences
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default SettingsPage;
