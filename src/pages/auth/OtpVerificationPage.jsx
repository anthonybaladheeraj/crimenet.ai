import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Shield,
  Smartphone,
  ArrowLeft,
  RotateCcw,
  CheckCircle2,
  Lock,
  AlertCircle
} from 'lucide-react';

const OtpVerificationPage = () => {
  const navigate = useNavigate();
  const { pendingOfficerId, completeOtpVerification } = useAuth();

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [resendNotice, setResendNotice] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const inputRefs = useRef([]);

  // Auto focus first input on mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  // Countdown timer
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const handleDigitChange = (index, value) => {
    // Only allow single digit
    const cleaned = value.replace(/\D/g, '').slice(-1);
    const newOtp = [...otp];
    newOtp[index] = cleaned;
    setOtp(newOtp);
    setErrorMsg('');

    // Advance to next box if digit entered
    if (cleaned && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0 && inputRefs.current[index - 1]) {
        inputRefs.current[index - 1].focus();
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pastedData) return;

    const newOtp = [...otp];
    for (let i = 0; i < pastedData.length; i++) {
      newOtp[i] = pastedData[i];
    }
    setOtp(newOtp);

    // Focus on next empty or the last input
    const nextIndex = Math.min(pastedData.length, 5);
    if (inputRefs.current[nextIndex]) {
      inputRefs.current[nextIndex].focus();
    }
  };

  const handleResendOtp = () => {
    if (!canResend) return;
    setCountdown(60);
    setCanResend(false);
    setResendNotice(true);
    setTimeout(() => setResendNotice(false), 5000);
  };

  const handleVerify = (e) => {
    e.preventDefault();
    const enteredCode = otp.join('');
    if (enteredCode.length < 6) {
      setErrorMsg('Please enter all 6 digits of the OTP code.');
      return;
    }

    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      completeOtpVerification();
      navigate('/dashboard');
    }, 600);
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
            TWO-FACTOR GATEWAY
          </span>
        </div>
      </div>

      {/* Main Content */}
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
            maxWidth: '480px',
            backgroundColor: 'var(--color-bg-card)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-xl)',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)',
            padding: '2.5rem 2.25rem',
            textAlign: 'center'
          }}
        >
          {/* Top Device Icon */}
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: 'rgba(0, 180, 216, 0.15)',
            border: '1px solid rgba(0, 180, 216, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem',
            color: 'var(--color-primary)',
            boxShadow: '0 0 16px rgba(0, 180, 216, 0.2)'
          }}>
            <Smartphone size={32} />
          </div>

          <h2 style={{
            fontSize: '1.4rem',
            fontWeight: 800,
            color: 'var(--color-text-primary)',
            marginBottom: '0.4rem'
          }}>
            OTP Verification
          </h2>

          <p style={{
            fontSize: '0.875rem',
            color: 'var(--color-text-secondary)',
            marginBottom: '1.75rem',
            lineHeight: 1.5
          }}>
            Enter the OTP sent to your registered device.
            <br />
            <span style={{ fontSize: '0.78rem', color: 'var(--color-accent-gold)', fontWeight: 600 }}>
              Designated Officer: {pendingOfficerId || 'OFF-84920'}
            </span>
          </p>

          {/* 6 Digit Input Boxes */}
          <form onSubmit={handleVerify}>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '10px',
              marginBottom: '1.5rem'
            }}>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleDigitChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  style={{
                    width: '52px',
                    height: '56px',
                    textAlign: 'center',
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    fontFamily: 'var(--font-mono)',
                    color: '#FFFFFF',
                    backgroundColor: 'var(--color-bg-input)',
                    border: digit ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    outline: 'none',
                    transition: 'all 0.15s ease',
                    boxShadow: digit ? '0 0 8px rgba(0, 180, 216, 0.25)' : 'none'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--color-primary)';
                    e.target.select();
                  }}
                  onBlur={(e) => {
                    if (!digit) e.target.style.borderColor = 'var(--color-border)';
                  }}
                />
              ))}
            </div>

            {errorMsg && (
              <div style={{
                marginBottom: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                color: 'var(--color-accent-danger)',
                fontSize: '0.8rem'
              }}>
                <AlertCircle size={14} />
                <span>{errorMsg}</span>
              </div>
            )}

            {resendNotice && (
              <div style={{
                marginBottom: '1.25rem',
                padding: '0.625rem 0.875rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'rgba(16, 185, 129, 0.12)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                color: 'var(--color-accent-success)',
                fontSize: '0.78rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}>
                <CheckCircle2 size={16} />
                <span>A new verification passcode has been dispatched.</span>
              </div>
            )}

            {/* Countdown / Resend UI */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              fontSize: '0.8125rem',
              color: 'var(--color-text-secondary)',
              marginBottom: '1.75rem'
            }}>
              {canResend ? (
                <button
                  type="button"
                  onClick={handleResendOtp}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--color-primary)',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <RotateCcw size={14} />
                  Resend OTP
                </button>
              ) : (
                <span>
                  Resend OTP in{' '}
                  <strong style={{ color: 'var(--color-accent-gold)', fontFamily: 'var(--font-mono)' }}>
                    00:{countdown < 10 ? `0${countdown}` : countdown}
                  </strong>
                </span>
              )}
            </div>

            {/* Verify Button */}
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isVerifying}
              style={{
                width: '100%',
                padding: '0.875rem',
                fontSize: '0.95rem',
                fontWeight: 600,
                marginBottom: '1rem'
              }}
            >
              {isVerifying ? (
                <>Verifying Credentials...</>
              ) : (
                <>
                  <CheckCircle2 size={18} />
                  Verify OTP & Access Portal
                </>
              )}
            </button>

            {/* Back to login option */}
            <button
              type="button"
              onClick={() => navigate('/login')}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-text-muted)',
                fontSize: '0.8125rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 8px',
                transition: 'color 0.15s ease'
              }}
              onMouseOver={(e) => e.currentTarget.style.color = 'var(--color-text-primary)'}
              onMouseOut={(e) => e.currentTarget.style.color = 'var(--color-text-muted)'}
            >
              <ArrowLeft size={14} />
              Back to Login
            </button>
          </form>
        </div>
      </div>

      {/* Legal Footer */}
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

export default OtpVerificationPage;
