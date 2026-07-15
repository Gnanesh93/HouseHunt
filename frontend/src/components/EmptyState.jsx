import React from 'react';

const EmptyState = ({ title = 'No Data Found', message = 'There are no items to display at this time.', actionText, onAction }) => {
  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '3rem 1.5rem',
    textAlign: 'center',
    background: 'var(--white)',
    border: '1px dashed var(--slate-300)',
    borderRadius: 'var(--radius-md)',
    margin: '2rem 0'
  };

  const iconStyle = {
    width: '64px',
    height: '64px',
    color: 'var(--slate-300)',
    marginBottom: '1.5rem'
  };

  return (
    <div style={containerStyle}>
      <svg style={iconStyle} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 0 1 2.008 1.24l.885 1.77a2.25 2.25 0 0 0 2.007 1.24h1.98a2.25 2.25 0 0 0 2.007-1.24l.885-1.77a2.25 2.25 0 0 1 2.007-1.24h3.86m-18 0h18a2.25 2.25 0 0 1 2.25 2.25v4.5A2.25 2.25 0 0 1 19.5 21h-15A2.25 2.25 0 0 1 2.25 18.75v-4.5A2.25 2.25 0 0 1 2.25 13.5Zm0-9.75h18A2.25 2.25 0 0 1 21.75 6v4.5A2.25 2.25 0 0 1 19.5 12.75h-15A2.25 2.25 0 0 1 2.25 10.5V6A2.25 2.25 0 0 1 4.25 3.75Z" />
      </svg>
      <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', fontWeight: 600 }}>{title}</h3>
      <p style={{ color: 'var(--slate-500)', fontSize: '0.95rem', maxWidth: '350px', marginBottom: '1.5rem' }}>{message}</p>
      {actionText && onAction && (
        <button onClick={onAction} className="btn btn-primary">
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
