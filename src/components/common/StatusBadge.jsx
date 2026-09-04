import React from 'react';

const StatusBadge = ({ status = 'ACTIVE', type = 'default' }) => {
  let badgeClass = 'badge-blue';

  const s = status.toUpperCase();
  if (s === 'HIGH' || s === 'CRITICAL' || s === 'OVERDUE' || s === 'URGENT') {
    badgeClass = 'badge-red';
  } else if (s === 'SOLVED' || s === 'RESOLVED' || s === 'VERIFIED' || s === 'SECURE') {
    badgeClass = 'badge-green';
  } else if (s === 'PENDING' || s === 'MEDIUM' || s === 'REVIEW' || s === 'ESCALATED') {
    badgeClass = 'badge-gold';
  } else if (s === 'CLOSED' || s === 'LOW' || s === 'ARCHIVED') {
    badgeClass = 'badge-gray';
  }

  return (
    <span className={`badge ${badgeClass}`}>
      <span style={{
        width: '6px',
        height: '6px',
        borderRadius: '50%',
        backgroundColor: 'currentColor'
      }} />
      {status}
    </span>
  );
};

export default StatusBadge;
