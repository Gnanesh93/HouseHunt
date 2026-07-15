import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Navbar from '../../../components/Navbar';
import Sidebar from '../../../components/Sidebar';
import LoadingSpinner from '../../../components/LoadingSpinner';
import EmptyState from '../../../components/EmptyState';
import api from '../../../services/api';

const AllBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchIncomingBookings = async () => {
    setLoading(true);
    try {
      const response = await api.get('/owner/bookings');
      if (response.data && response.data.success) {
        setBookings(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching owner bookings:', error);
      toast.error('Could not load booking requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncomingBookings();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      const response = await api.put(`/owner/bookings/${id}/status`, { status });
      if (response.data && response.data.success) {
        toast.success(`Booking successfully ${status}`);
        // Locally update status to avoid full refresh
        setBookings(prev => prev.map(b => b._id === id ? { ...b, status } : b));
      } else {
        toast.error(response.data.message || 'Operation failed');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error updating booking status');
    }
  };

  return (
    <div className="app-container">
      <Navbar />
      <div className="dashboard-layout">
        <Sidebar />
        <main className="dashboard-main">
          <div style={{ marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>Tenant Booking Requests</h1>
            <p style={{ color: 'var(--slate-500)', fontSize: '0.95rem' }}>Review applications, coordinate move-in dates, and approve/reject bookings.</p>
          </div>

          {loading ? (
            <LoadingSpinner fullPage={false} />
          ) : bookings.length === 0 ? (
            <EmptyState 
              title="No Booking Requests" 
              message="There are no active booking requests on your property listings yet."
            />
          ) : (
            <div className="card" style={{ padding: 0 }}>
              <div className="table-wrapper" style={{ border: 'none', marginTop: 0 }}>
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Renter Info</th>
                      <th>Property Title</th>
                      <th>Move-In Date</th>
                      <th>Contact</th>
                      <th>Message</th>
                      <th>Status</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((booking) => (
                      <tr key={booking._id}>
                        <td>
                          <div style={{ fontWeight: 600 }}>{booking.userId?.name || 'Deleted User'}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>{booking.userId?.email}</div>
                        </td>
                        <td style={{ fontWeight: 500 }}>
                          {booking.propertyId?.title || 'Deleted Property'}
                        </td>
                        <td>{new Date(booking.moveInDate).toLocaleDateString()}</td>
                        <td>{booking.contactNumber}</td>
                        <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={booking.message}>
                          {booking.message || <em style={{ color: 'var(--slate-400)' }}>No message</em>}
                        </td>
                        <td>
                          <span className={`badge badge-${booking.status}`}>
                            {booking.status}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          {booking.status === 'pending' ? (
                            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                              <button 
                                onClick={() => handleUpdateStatus(booking._id, 'approved')} 
                                className="btn btn-primary" 
                                style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', backgroundColor: 'var(--success)' }}
                              >
                                Approve
                              </button>
                              <button 
                                onClick={() => handleUpdateStatus(booking._id, 'rejected')} 
                                className="btn btn-danger" 
                                style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                              >
                                Reject
                              </button>
                            </div>
                          ) : (
                            <span style={{ fontSize: '0.85rem', color: 'var(--slate-500)', fontWeight: 600 }}>
                              Decided
                            </span>
                          )}
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
