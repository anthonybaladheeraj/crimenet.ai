import React from 'react';
import { Database, ShieldCheck, SearchX, FileQuestion } from 'lucide-react';

const EmptyState = ({
  icon: Icon = Database,
  title = "No data available",
  description = "No records currently match your query or database synchronization is pending.",
  actionText,
  onAction,
  badgeText = "Awaiting Records"
}) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '3.5rem 2rem',
      textAlign: 'center',
      backgroundColor: 'rgba(8, 17, 45, 0.4)',
      borderRadius: 'var(--radius-lg)',
      border: '1px dashed var(--color-border)',
      margin: '1rem 0'
    }}>
      <div style={{
        width: '56px',
        height: '56px',
        borderRadius: '50%',
        backgroundColor: 'rgba(30, 45, 90, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '1.25rem',
        color: 'var(--color-primary)'
      }}>
        <Icon size={26} strokeWidth={1.75} />
      </div>

      <div style={{ marginBottom: '0.75rem' }}>
        <span className="badge badge-gray" style={{ fontSize: '0.7rem' }}>
          {badgeText}
        </span>
      </div>

      <h4 style={{
        fontSize: '1.1rem',
        fontWeight: 600,
        color: 'var(--color-text-primary)',
        marginBottom: '0.5rem'
      }}>
        {title}
      </h4>

      <p style={{
        fontSize: '0.875rem',
        color: 'var(--color-text-secondary)',
        maxWidth: '480px',
        lineHeight: 1.5,
        marginBottom: actionText ? '1.25rem' : '0'
      }}>
        {description}
      </p>

      {actionText && (
        <button className="btn btn-secondary btn-sm" onClick={onAction}>
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
