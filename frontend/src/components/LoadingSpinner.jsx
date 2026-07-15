import React from 'react';

const LoadingSpinner = ({ fullPage = true }) => {
  const spinnerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: fullPage ? '70vh' : '200px',
    flexDirection: 'column',
    gap: '1rem'
  };

  const ringStyle = {
    width: '48px',
    height: '48px',
    border: '4px solid var(--primary-light)',
    borderTopColor: 'var(--primary-base)',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  };

  return (
    <div style={spinnerStyle}>
      <div style={ringStyle}></div>
      <p style={{ color: 'var(--slate-500)', fontWeight: 500, fontSize: '0.9rem' }}>Loading, please wait...</p>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default LoadingSpinner;
