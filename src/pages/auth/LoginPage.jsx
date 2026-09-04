import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Shield,
  Lock,
  User,
  Eye,
  EyeOff,
  AlertCircle,
  LogIn
} from 'lucide-react';
import Modal from '../../components/common/Modal';

const LoginPage = () => {
  const navigate = useNavigate();
  const { initiateLogin } = useAuth();

  const [officerId, setOfficerId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);

  const validate = () => {
    const errs = {};
    if (!officerId.trim()) {
      errs.officerId = 'Officer ID is required.';
    }
    if (!password.trim()) {
      errs.password = 'Password is required.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      initiateLogin(officerId.trim());
      navigate('/otp');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: 'var(--color-bg-primary)',
      background: 'radial-gradient(ellipse at top, #111e48 0%, #070F2B 70%)',
      position: 'relative'
    }}>
      {/* Top Law Enforcement Header Bar */}
      <div style={{
        padding: '0.875rem 2rem',
        borderBottom: '1px solid var(--color-border)',
        backgroundColor: 'rgba(7, 15, 43, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Shield size={20} color="var(--color-primary)" />
          <span style={{ fontSize: '0.8125rem', fontWeight: 700, letterSpacing: '0.05em', color: 'var(--color-text-primary)' }}>
            MINISTRY OF HOME AFFAIRS // LAW ENFORCEMENT CYBER INTELLIGENCE
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="badge badge-gold" style={{ fontSize: '0.6875rem' }}>
            SMART INDIA HACKATHON PROTOTYPE
          </span>
        </div>
      </div>

      {/* Main Login Container */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1rem'
      }}>
        <div 
          className="animate-fade-in"
          style={{
            width: '100%',
            maxWidth: '440px',
            backgroundColor: 'var(--color-bg-card)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-xl)',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)',
            padding: '2.5rem 2.25rem',
            position: 'relative'
          }}
        >
          {/* Logo & Header */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, rgba(0, 180, 216, 0.25) 0%, rgba(17, 30, 72, 0.9) 100%)',
              border: '1px solid rgba(0, 180, 216, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem',
              boxShadow: '0 0 20px rgba(0, 180, 216, 0.25)'
            }}>
              <Shield size={32} color="#00B4D8" />
            </div>

            <h3 style={{
              fontSize: '1.45rem',
              fontWeight: 800,
              color: 'var(--color-text-primary)',
              letterSpacing: '-0.01em',
              lineHeight: 1.25,
              marginBottom: '0.35rem'
            }}>
              Officer Login
            </h3>

            <p style={{
              fontSize: '0.8125rem',
              color: 'var(--color-accent-gold)',
              fontWeight: 600,
              letterSpacing: '0.04em',
              textTransform: 'uppercase'
            }}>
              Criminal Network Analysis System
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} noValidate>
            {/* Officer ID field */}
            <div className="form-group">
              <label className="form-label" htmlFor="officerId">
                <User size={14} />
                Officer ID
              </label>
              <div className="form-input-wrapper">
                <span className="form-icon-left">
                  <User size={16} />
                </span>
                <input
                  id="officerId"
                  type="text"
                  className="form-input has-icon-left"
                  placeholder="Enter Officer ID"
                  value={officerId}
                  onChange={(e) => {
                    setOfficerId(e.target.value);
                    if (errors.officerId) {
                      setErrors((prev) => ({ ...prev, officerId: null }));
                    }
                  }}
                  autoComplete="username"
                />
              </div>
              {errors.officerId && (
                <div className="form-error">
                  <AlertCircle size={13} />
                  <span>{errors.officerId}</span>
                </div>
              )}
            </div>

            {/* Password field */}
            <div className="form-group">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <label className="form-label" htmlFor="password" style={{ marginBottom: 0 }}>
                  <Lock size={14} />
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setIsForgotModalOpen(true)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--color-primary)',
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                    textDecoration: 'none'
                  }}
                >
                  Forgot Password?
                </button>
              </div>

              <div className="form-input-wrapper">
                <span className="form-icon-left">
                  <Lock size={16} />
                </span>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  className="form-input has-icon-left has-icon-right"
                  placeholder="Enter Password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) {
                      setErrors((prev) => ({ ...prev, password: null }));
                    }
                  }}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="form-icon-right"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <div className="form-error">
                  <AlertCircle size={13} />
                  <span>{errors.password}</span>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '0.85rem',
                fontSize: '0.95rem',
                fontWeight: 600,
                marginTop: '0.75rem'
              }}
            >
              <LogIn size={18} />
              Login
            </button>
          </form>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <Modal
        isOpen={isForgotModalOpen}
        onClose={() => setIsForgotModalOpen(false)}
        title="Account Recovery & Departmental Verification"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
            In accordance with law-enforcement security protocols, automated password resets are disabled on central intelligence nodes.
          </p>
          <div style={{
            padding: '1rem',
            backgroundColor: 'rgba(8, 17, 45, 0.7)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-border)',
            fontSize: '0.8125rem',
            color: 'var(--color-text-primary)'
          }}>
            <strong style={{ color: 'var(--color-accent-gold)' }}>Contact Department System Administrator:</strong>
            <ul style={{ marginTop: '0.5rem', paddingLeft: '1.25rem', color: 'var(--color-text-secondary)' }}>
              <li>Submit an official key reset ticket via your State Cyber Cell.</li>
              <li>Provide your Warrant Card / Service ID to your designated nodal officer.</li>
              <li>Physical biometric verification may be required for credential re-issuance.</li>
            </ul>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
            <button 
              type="button" 
              className="btn btn-primary btn-sm" 
              onClick={() => setIsForgotModalOpen(false)}
            >
              Understood
            </button>
          </div>
        </div>
      </Modal>

      {/* Security notice footer */}
      <div style={{
        borderTop: '1px solid var(--color-border)',
        padding: '1rem 1.5rem',
        backgroundColor: 'rgba(7, 15, 43, 0.95)',
        textAlign: 'center',
        fontSize: '0.75rem',
        color: 'var(--color-text-muted)'
      }}>
        This system is intended for authorized law-enforcement use only. Access to information is subject to applicable laws, departmental policies, and required permissions.
      </div>
    </div>
  );
};

export default LoginPage;
