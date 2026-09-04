import React from 'react';
import { ShieldAlert } from 'lucide-react';

const LegalNoticeFooter = () => {
  return (
    <footer style={{
      borderTop: '1px solid var(--color-border)',
      padding: '1.25rem 2rem',
      backgroundColor: 'rgba(8, 15, 43, 0.95)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '12px',
      color: 'var(--color-text-muted)',
      fontSize: '0.78rem',
      textAlign: 'center',
      marginTop: 'auto'
    }}>
      <ShieldAlert size={16} color="var(--color-accent-amber)" style={{ flexShrink: 0 }} />
      <span>
        <strong>OFFICIAL NOTICE:</strong> This system is intended for authorized law-enforcement use only. Access to information is subject to applicable laws, departmental policies, and required permissions.
      </span>
    </footer>
  );
};

export default LegalNoticeFooter;
