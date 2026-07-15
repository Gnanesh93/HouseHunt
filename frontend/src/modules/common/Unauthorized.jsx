import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const Unauthorized = () => {
  const { user } = useContext(AuthContext);

  const homePath = user?.role === 'admin' ? '/admin/dashboard' : user?.role === 'owner' ? '/owner/dashboard' : user ? '/user/home' : '/';

  return (
    <div className="app-container">
      <Navbar />
      <div className="auth-page" style={{ flexDirection: 'column', textAlign: 'center', gap: '1rem' }}>
        <div
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            backgroundColor: 'var(--error-light)',
            color: 'var(--error)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2.5rem'
          }}
        >
          ⛔
        </div>
        <h2 style={{ fontSize: '1.75rem' }}>Access Denied</h2>
        <p style={{ color: 'var(--slate-500)', maxWidth: '420px' }}>
          You don't have permission to view this page. This area is restricted based on your account role.
        </p>
        <Link to={homePath} className="btn btn-primary" style={{ marginTop: '1rem' }}>
          Return to Safety
        </Link>
      </div>
      <Footer />
    </div>
  );
};

export default Unauthorized;
