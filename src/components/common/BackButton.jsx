import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const BackButton = ({ to, label = 'Back', fallback = '/dashboard' }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (to) {
      navigate(to);
    } else if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate(fallback);
    }
  };

  return (
    <button
      type="button"
      className="btn btn-secondary btn-sm"
      onClick={handleBack}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '0.45rem 0.875rem',
        fontSize: '0.8125rem'
      }}
    >
      <ArrowLeft size={15} />
      <span>{label}</span>
    </button>
  );
};

export default BackButton;
