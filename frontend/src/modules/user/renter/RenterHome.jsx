import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../../context/AuthContext';
import Navbar from '../../../components/Navbar';
import Sidebar from '../../../components/Sidebar';
import LoadingSpinner from '../../../components/LoadingSpinner';
import api from '../../../services/api';

const RenterHome = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalBookings: 0,
    pending: 0,
    approved: 0,
    cancelled: 0
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get('/users/bookings');
        if (response.data && response.data.success) {
          const bookings = response.data.data;
          setRecentBookings(bookings.slice(0, 3)); // show top 3 recent
          
          const totalBookings = bookings.length;
          const pending = bookings.filter(b => b.status === 'pending').length;
          const approved = bookings.filter(b => b.status === 'approved').length;
          const cancelled = bookings.filter(b => b.status === 'cancelled').length;

          setStats({ totalBookings, pending, approved, cancelled });
        }
      } catch (error) {
        console.error('Error fetching renter dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const metricContainerStyle = {
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
          {/* Welcome Banner */}
          <div style={{ marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>Welcome Back, {user?.name}!</h1>
            <p style={{ color: 'var(--slate-500)', fontSize: '0.95rem' }}>Here is your rental dashboard overview and recent booking activities.</p>
          </div>

          {loading ? (
            <LoadingSpinner fullPage={false} />
          ) : (
            <>
              {/* Renter Dashboard Stats */}
              <div style={metricContainerStyle}>
                <div className="card stat-card">
                  <div className="stat-icon" style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary-base)' }}>
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
                    <h3 className="stat-value">{stats.pending}</h3>
                    <p className="stat-label">Pending Requests</p>
                  </div>
                </div>

                <div className="card stat-card">
                  <div className="stat-icon" style={{ backgroundColor: 'var(--success-light)', color: 'var(--success)' }}>
                    <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="stat-value">{stats.approved}</h3>
                    <p className="stat-label">Approved Leases</p>
                  </div>
                </div>
              </div>

              {/* Action and Recents */}
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                {/* Recent Bookings List */}
                <div className="card">
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>Recent Booking Requests</span>
                    <Link to="/user/bookings" style={{ fontSize: '0.85rem', color: 'var(--primary-base)' }}>View All</Link>
                  </h3>

                  {recentBookings.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                      <p style={{ color: 'var(--slate-500)', marginBottom: '1rem' }}>You haven't requested any property bookings yet.</p>
                      <button onClick={() => navigate('/user/properties')} className="btn btn-primary">Browse Properties</button>
                    </div>
                  ) : (
                    <div className="table-wrapper" style={{ marginTop: 0 }}>
                      <table className="custom-table">
                        <thead>
                          <tr>
                            <th>Property</th>
                            <th>Move-In Date</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {recentBookings.map((booking) => (
                            <tr key={booking._id}>
                              <td style={{ fontWeight: 600 }}>{booking.propertyId?.title || 'Unknown Property'}</td>
                              <td>{new Date(booking.moveInDate).toLocaleDateString()}</td>
                              <td>
                                <span className={`badge badge-${booking.status}`}>
                                  {booking.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* Quick actions box */}
                <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', justifyContent: 'center', background: 'linear-gradient(135deg, var(--slate-900), var(--slate-800))', color: 'var(--white)' }}>
                  <h3 style={{ color: 'var(--white)', fontSize: '1.2rem', marginBottom: '0.5rem' }}>Looking for a House?</h3>
                  <p style={{ color: 'var(--slate-400)', fontSize: '0.9rem', marginBottom: '1rem', lineHeight: '1.5' }}>
                    Search through dozens of verified property rental listings across cities.
                  </p>
                  <button onClick={() => navigate('/user/properties')} className="btn btn-primary" style={{ alignSelf: 'start', backgroundColor: 'var(--accent-purple)' }}>
                    Start Searching
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

export default RenterHome;
