import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import LoadingSpinner from '../../components/LoadingSpinner';
import api from '../../services/api';

const AdminHome = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProperties: 0,
    totalBookings: 0,
    totalRevenue: 0,
    usersDistribution: { renters: 0, owners: 0, admins: 0 },
    propertiesStatus: { available: 0, rented: 0 }
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        const response = await api.get('/admin/dashboard');
        if (response.data && response.data.success) {
          setStats(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching admin dashboard statistics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminStats();
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
          {/* Dashboard Header */}
          <div style={{ marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>Administrator Console</h1>
            <p style={{ color: 'var(--slate-500)', fontSize: '0.95rem' }}>Global platform configuration, account moderation, and analytics review.</p>
          </div>

          {loading ? (
            <LoadingSpinner fullPage={false} />
          ) : (
            <>
              {/* Analytics grid */}
              <div style={statsGridStyle}>
                <div className="card stat-card">
                  <div className="stat-icon" style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary-base)' }}>
                    <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="stat-value">{stats.totalUsers}</h3>
                    <p className="stat-label">Total Accounts</p>
                  </div>
                </div>

                <div className="card stat-card">
                  <div className="stat-icon" style={{ backgroundColor: 'var(--accent-purple)', color: '#fff' }}>
                    <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="stat-value">{stats.totalProperties}</h3>
                    <p className="stat-label">Total Listings</p>
                  </div>
                </div>

                <div className="card stat-card">
                  <div className="stat-icon" style={{ backgroundColor: 'var(--warning-light)', color: 'var(--warning)' }}>
                    <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="stat-value">{stats.totalBookings}</h3>
                    <p className="stat-label">Lease Bookings</p>
                  </div>
                </div>

                <div className="card stat-card">
                  <div className="stat-icon" style={{ backgroundColor: 'var(--success-light)', color: 'var(--success)' }}>
                    <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="stat-value">₹{stats.totalRevenue.toLocaleString()}</h3>
                    <p className="stat-label">Processed Rent Value</p>
                  </div>
                </div>
              </div>

              {/* Sub-panels details */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                {/* Users Distribution Card */}
                <div className="card">
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>User Profiles Distribution</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--slate-100)', paddingBottom: '0.5rem' }}>
                      <span style={{ fontWeight: 500, color: 'var(--slate-600)' }}>Renters (Standard Users)</span>
                      <strong style={{ fontSize: '1.1rem' }}>{stats.usersDistribution?.renters || 0}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--slate-100)', paddingBottom: '0.5rem' }}>
                      <span style={{ fontWeight: 500, color: 'var(--slate-600)' }}>Owners (Hosts)</span>
                      <strong style={{ fontSize: '1.1rem' }}>{stats.usersDistribution?.owners || 0}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem' }}>
                      <span style={{ fontWeight: 500, color: 'var(--slate-600)' }}>Administrators</span>
                      <strong style={{ fontSize: '1.1rem' }}>{stats.usersDistribution?.admins || 0}</strong>
                    </div>
                  </div>
                  <button onClick={() => navigate('/admin/users')} className="btn btn-secondary btn-block" style={{ marginTop: '1.5rem' }}>
                    Moderate User Accounts
                  </button>
                </div>

                {/* Properties Status Card */}
                <div className="card">
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Listings Availability Status</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--slate-100)', paddingBottom: '0.5rem' }}>
                      <span style={{ fontWeight: 500, color: 'var(--slate-600)' }}>Active/Available on Market</span>
                      <strong style={{ color: 'var(--success)', fontSize: '1.1rem' }}>{stats.propertiesStatus?.available || 0}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem' }}>
                      <span style={{ fontWeight: 500, color: 'var(--slate-600)' }}>Rented/Leased/Unavailable</span>
                      <strong style={{ color: 'var(--error)', fontSize: '1.1rem' }}>{stats.propertiesStatus?.rented || 0}</strong>
                    </div>
                  </div>
                  <button onClick={() => navigate('/admin/properties')} className="btn btn-secondary btn-block" style={{ marginTop: '2.5rem' }}>
                    Review Property Inventory
                  </button>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminHome;
