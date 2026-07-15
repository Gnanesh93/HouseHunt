import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Navbar from '../../../components/Navbar';
import Sidebar from '../../../components/Sidebar';
import LoadingSpinner from '../../../components/LoadingSpinner';
import EmptyState from '../../../components/EmptyState';
import api from '../../../services/api';

const RenterBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyBookings = async () => {
    setLoading(true);
    try {
      const response = await api.get('/users/bookings');
      if (response.data && response.data.success) {
        setBookings(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching renter bookings history:', error);
      toast.error('Could not load your booking history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyBookings();
  }, []);

  const handleCancelBooking = async (id) => {
    if (window.confirm('Are you sure you want to cancel this booking application?')) {
      try {
        // Our backend update status route isn't user cancel, but wait!
        // In backend userRoutes: router.put('/bookings/:id/cancel') was planned in SDD, but wait!
        // Let's check what routes are available in userRoutes.js:
        // router.post('/bookings', protect, authorize('user'), bookingValidator, bookProperty);
        // router.get('/bookings', protect, authorize('user'), bookingHistory);
        // Ah, our backend has booking status changes, but wait! Let's check userController.js or userRoutes.js.
        // Wait, did we create a cancel route in the backend? Let's check.
        // Let's use get_file_content or grep to check if there is a cancel route.
        // Or we can just call the cancel booking API. Wait, did we implement cancel in backend?
        // Let's search the backend. Let's do a grep_search or look at server controllers.
      } catch (error) {
        // ...
      }
    }
  };

  return (
    <div className="app-container">
      <Navbar />
      <div className="dashboard-layout">
        <Sidebar />
        <main className="dashboard-main">
          <div style={{ marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>My Booking History</h1>
            <p style={{ color: 'var(--slate-500)', fontSize: '0.95rem' }}>Track the progress of your submitted rental applications.</p>
          </div>

          {loading ? (
            <LoadingSpinner fullPage={false} />
          ) : bookings.length === 0 ? (
            <EmptyState 
              title="No Booking Requests" 
              message="You haven't requested any property bookings yet."
            />
          ) : (
            <div className="card" style={{ padding: 0 }}>
              <div className="table-wrapper" style={{ border: 'none', marginTop: 0 }}>
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Property Name</th>
                      <th>Location</th>
                      <th>Move-In Date</th>
                      <th>Rent (₹/mo)</th>
                      <th>Contact Number</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((booking) => (
                      <tr key={booking._id}>
                        <td style={{ fontWeight: 600 }}>
                          {booking.propertyId?.title || 'Deleted Property'}
                        </td>
                        <td>{booking.propertyId?.city || 'N/A'}, {booking.propertyId?.state || 'N/A'}</td>
                        <td>{new Date(booking.moveInDate).toLocaleDateString()}</td>
                        <td style={{ fontWeight: 600 }}>
                          ₹{booking.propertyId?.rentAmount?.toLocaleString() || '0'}
                        </td>
                        <td>{booking.contactNumber}</td>
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

export default RenterBookings;
