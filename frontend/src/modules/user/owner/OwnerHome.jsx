import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../../../components/Navbar';
import Sidebar from '../../../components/Sidebar';
import LoadingSpinner from '../../../components/LoadingSpinner';
import api from '../../../services/api';
import { AuthContext } from '../../../context/AuthContext';

const OwnerHome = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalProperties: 0,
    totalBookings: 0,
    pendingBookings: 0,
    approvedBookings: 0,
    cancelledBookings: 0,
    totalEarnings: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const response = await api.get('/owner/dashboard');
        if (response.data && response.data.success) {
          setStats(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching owner dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  const statsGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '1.5rem',
    marginBottom: '2.5rem'
  };

  return (
    <div className="app-container">
      <Navbar />
      <div className="dashboard-layout">
        <Sidebar />
        <main className="dashboard-main">
          {/* Header Banner */}
          <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>Owner Dashboard</h1>
              <p style={{ color: 'var(--slate-500)', fontSize: '0.95rem' }}>Monitor your real estate investments, listings, and tenant applications.</p>
            </div>
            <Link to="/owner/add-property" className="btn btn-primary">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" style={{ marginRight: '0.25rem' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              List New Property
            </Link>
          </div>

          {loading ? (
            <LoadingSpinner fullPage={false} />
          ) : (
            <>
              {/* Owner Stats Cards */}
              <div style={statsGridStyle}>
                <div className="card stat-card">
                  <div className="stat-icon" style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary-base)' }}>
                    <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="stat-value">{stats.totalProperties}</h3>
                    <p className="stat-label">Total Properties</p>
                  </div>
                </div>

                <div className="card stat-card">
                  <div className="stat-icon" style={{ backgroundColor: 'var(--accent-purple)', color: '#fff' }}>
                    <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="stat-value">{stats.totalBookings}</h3>
                    <p className="stat-label">Total Bookings</p>
                  </div>
                </div>

                <div className="card stat-card">
                  <div className="stat-icon" style={{ backgroundColor: 'var(--warning-light)', color: 'var(--warning)' }}>
                    <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="stat-value">{stats.pendingBookings}</h3>
                    <p className="stat-label">Pending Applications</p>
                  </div>
                </div>

                <div className="card stat-card">
                  <div className="stat-icon" style={{ backgroundColor: 'var(--success-light)', color: 'var(--success)' }}>
                    <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M12 16v1" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="stat-value">₹{stats.totalEarnings.toLocaleString()}</h3>
                    <p className="stat-label">Est. Monthly Earnings</p>
                  </div>
                </div>
              </div>

              {/* Layout splits */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '260px' }}>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Listing Inventory Summary</h3>
                    <p style={{ color: 'var(--slate-500)', fontSize: '0.9rem', lineHeight: '1.5' }}>
                      Keep track of which listings are active on the market and which properties are currently rented out to tenants.
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1.5rem' }}>
                    <Link to="/owner/properties" className="btn btn-secondary" style={{ flex: 1 }}>
                      Manage Listings
                    </Link>
                    <Link to="/owner/add-property" className="btn btn-primary" style={{ flex: 1 }}>
                      Add New Listing
                    </Link>
                  </div>
                </div>

                <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '260px' }}>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Tenant Action Center</h3>
                    <p style={{ color: 'var(--slate-500)', fontSize: '0.9rem', lineHeight: '1.5' }}>
                      You have **{stats.pendingBookings}** pending booking requests awaiting review. Approving booking applications sets the property listing as rented automatically.
                    </p>
                  </div>
                  <Link to="/owner/bookings" className="btn btn-accent" style={{ marginTop: '1.5rem' }}>
                    Review Booking Requests
                  </Link>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default OwnerHome;
