import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import api from '../../services/api';

const AllBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllBookings = async () => {
      try {
        const response = await api.get('/admin/bookings');
        if (response.data && response.data.success) {
          setBookings(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching admin bookings history:', error);
        toast.error('Could not load global transaction log');
      } finally {
        setLoading(false);
      }
    };

    fetchAllBookings();
  }, []);

  return (
    <div className="app-container">
      <Navbar />
      <div className="dashboard-layout">
        <Sidebar />
        <main className="dashboard-main">
          <div style={{ marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>Master Booking Log</h1>
            <p style={{ color: 'var(--slate-500)', fontSize: '0.95rem' }}>Monitor all active rental transactions, leases, and application states on the platform.</p>
          </div>

          {loading ? (
            <LoadingSpinner fullPage={false} />
          ) : bookings.length === 0 ? (
            <EmptyState 
              title="No Bookings Recorded" 
              message="No bookings have been made on the platform yet."
            />
          ) : (
            <div className="card" style={{ padding: 0 }}>
              <div className="table-wrapper" style={{ border: 'none', marginTop: 0 }}>
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Property Name</th>
                      <th>Renter Info</th>
                      <th>Owner Info</th>
                      <th>Move-In Date</th>
                      <th>Amount</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((booking) => (
                      <tr key={booking._id}>
                        <td style={{ fontWeight: 600 }}>
                          {booking.propertyId?.title || <em style={{ color: 'var(--slate-400)' }}>Deleted Property</em>}
                        </td>
                        <td>
                          <div style={{ fontWeight: 500 }}>{booking.userId?.name || 'Deleted User'}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>{booking.userId?.email}</div>
                        </td>
                        <td>
                          <div style={{ fontWeight: 500 }}>{booking.ownerId?.name || 'Deleted User'}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>{booking.ownerId?.email}</div>
                        </td>
                        <td>{new Date(booking.moveInDate).toLocaleDateString()}</td>
                        <td style={{ fontWeight: 600 }}>
                          ₹{booking.propertyId?.rentAmount?.toLocaleString() || '0'}
                        </td>
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
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AllBookings;
