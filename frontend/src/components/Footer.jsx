import React from 'react';
import {Link} from 'react-router-dom';

const Footer = () => {
  const footerStyle = {
    backgroundColor: 'var(--slate-900)',
    color: 'var(--slate-400)',
    padding: '3.5rem 2rem 1.5rem 2rem',
    fontFamily: 'var(--font-body)',
    borderTop: '1px solid var(--slate-800)'
  };

  const footerGridStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '2.5rem',
    marginBottom: '3rem'
  };

  const titleStyle = {
    color: 'var(--white)',
    fontFamily: 'var(--font-heading)',
    fontSize: '1.2rem',
    fontWeight: 700,
    marginBottom: '1rem'
  };

  const listStyle = {
    listStyle: 'none',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.65rem'
  };

  const linkStyle = {
    color: 'var(--slate-400)',
    transition: 'var(--transition-fast)',
    fontSize: '0.9rem'
  };

  return (
    <footer style={footerStyle}>
      <div style={footerGridStyle}>
        <div>
          <div style={{ ...titleStyle, color: 'var(--primary-base)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
            </svg>
            <span>HouseHunt</span>
          </div>
          <p style={{ fontSize: '0.9rem', lineHeight: '1.6', color: 'var(--slate-500)', marginTop: '0.5rem' }}>
            Discover the perfect rental properties that fit your style, budget, and location preference.
          </p>
        </div>

        <div>
          <h4 style={titleStyle}>For Renters</h4>
          <ul style={listStyle}>
            <li><Link to="/user/properties" style={linkStyle}>Browse Listings</Link></li>
            <li><Link to="/login" style={linkStyle}>Renter Sign In</Link></li>
            <li><Link to="/register" style={linkStyle}>Create Renter Account</Link></li>
          </ul>
        </div>

        <div>
          <h4 style={titleStyle}>For Owners</h4>
          <ul style={listStyle}>
            <li><Link to="/register" style={linkStyle}>List Your Property</Link></li>
            <li><Link to="/login" style={linkStyle}>Owner Login</Link></li>
            <li><Link to="/owner/dashboard" style={linkStyle}>Owner Console</Link></li>
          </ul>
        </div>

        <div>
          <h4 style={titleStyle}>Company</h4>
          <ul style={listStyle}>
            <li><a href="#" style={linkStyle}>About Us</a></li>
            <li><a href="#" style={linkStyle}>Privacy Policy</a></li>
            <li><a href="#" style={linkStyle}>Terms of Service</a></li>
          </ul>
        </div>
      </div>

      <div style={{ borderTop: '1px solid var(--slate-800)', paddingTop: '1.5rem', maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <p style={{ fontSize: '0.85rem', color: 'var(--slate-600)' }}>
          &copy; {new Date().getFullYear()} HouseHunt Inc. All rights reserved.
        </p>
        <p style={{ fontSize: '0.85rem', color: 'var(--slate-600)' }}>
          Designed with Love for modern living.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
