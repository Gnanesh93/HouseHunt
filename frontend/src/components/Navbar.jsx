import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navHeaderStyle = {
    height: '70px',
    backgroundColor: 'var(--white)',
    borderBottom: '1px solid var(--slate-200)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 2rem',
    position: 'sticky',
    top: 0,
    zIndex: 99,
    boxShadow: 'var(--shadow-sm)'
  };

  const logoStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '1.5rem',
    fontWeight: 800,
    fontFamily: 'var(--font-heading)',
    color: 'var(--primary-base)'
  };

  const navLinksStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
    listStyle: 'none'
  };

  const linkItemStyle = {
    fontWeight: 500,
    color: 'var(--slate-600)',
    transition: 'var(--transition-fast)',
    fontSize: '0.95rem'
  };

  return (
    <nav style={navHeaderStyle}>
      <Link to="/" style={logoStyle}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 9.3V4h-3v2.6L12 3 2 12h3v8h5v-6h4v6h5v-8h3l-3-2.7zm-9 .7c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2z"/>
        </svg>
        <span>HouseHunt</span>
      </Link>

      <ul style={navLinksStyle}>
        <li><Link to="/" style={linkItemStyle}>Home</Link></li>

        {user ? (
          <>
            {/* Renter Role Menu */}
            {user.role === 'user' && (
              <>
                <li><Link to="/user/properties" style={linkItemStyle}>Browse</Link></li>
                <li><Link to="/user/bookings" style={linkItemStyle}>My Bookings</Link></li>
              </>
            )}

            {/* Owner Role Menu */}
            {user.role === 'owner' && (
              <>
                <li><Link to="/owner/dashboard" style={linkItemStyle}>Dashboard</Link></li>
                <li><Link to="/owner/properties" style={linkItemStyle}>Listings</Link></li>
              </>
            )}

            {/* Admin Role Menu */}
            {user.role === 'admin' && (
              <>
                <li><Link to="/admin/dashboard" style={linkItemStyle}>Console</Link></li>
              </>
            )}

            {/* User Session Profile details */}
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderLeft: '1px solid var(--slate-200)', paddingLeft: '1.5rem' }}>
              <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }} title="View Profile">
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--slate-900)' }}>{user.name}</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--slate-500)', textTransform: 'capitalize' }}>{user.role === 'user' ? 'Renter' : user.role}</p>
                </div>
                {user.profileImage ? (
                  <img src={user.profileImage} alt={user.name} style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '38px', height: '38px', borderRadius: '50%', backgroundColor: 'var(--primary-light)', color: 'var(--primary-base)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.95rem' }}>
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </Link>
              <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
                Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li><Link to="/login" style={linkItemStyle}>Login</Link></li>
            <li><Link to="/register" className="btn btn-primary" style={{ padding: '0.5rem 1rem', color: '#fff', fontSize: '0.9rem' }}>Sign Up</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
