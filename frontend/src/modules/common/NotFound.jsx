import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const NotFound = () => {
  return (
    <div className="app-container">
      <Navbar />
      <div className="auth-page" style={{ flexDirection: 'column', textAlign: 'center', gap: '1rem' }}>
        <h1
          style={{
            fontSize: '6rem',
            background: 'linear-gradient(135deg, var(--primary-base), var(--accent-purple))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            lineHeight: 1
          }}
        >
          404
        </h1>
        <h2 style={{ fontSize: '1.5rem' }}>Page Not Found</h2>
        <p style={{ color: 'var(--slate-500)', maxWidth: '420px' }}>
          The page you're looking for doesn't exist or may have been moved. Let's get you back on track.
        </p>
        <Link to="/" className="btn btn-primary" style={{ marginTop: '1rem' }}>
          Back to Home
        </Link>
      </div>
      <Footer />
    </div>
  );
};

export default NotFound;
