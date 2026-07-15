import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import api from '../../services/api';

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/users');
      if (response.data && response.data.success) {
        setUsers(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching admin users:', error);
      toast.error('Could not load user profiles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteUser = async (id, name) => {
    if (window.confirm(`Are you sure you want to permanently delete user "${name}"? This will also delete all their listed properties and bookings.`)) {
      try {
        const response = await api.delete(`/admin/users/${id}`);
        if (response.data && response.data.success) {
          toast.success(response.data.message || 'User deleted successfully');
          setUsers(prev => prev.filter(u => u._id !== id));
        } else {
          toast.error(response.data.message || 'Deletion failed');
        }
      } catch (error) {
        toast.error(error.response?.data?.message || 'Error occurred during deletion');
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
            <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>Moderate User Accounts</h1>
            <p style={{ color: 'var(--slate-500)', fontSize: '0.95rem' }}>View registered user accounts and suspend/remove profiles if necessary.</p>
          </div>

          {loading ? (
            <LoadingSpinner fullPage={false} />
          ) : users.length === 0 ? (
            <EmptyState 
              title="No User Records" 
              message="No users have signed up on the platform yet."
            />
          ) : (
            <div className="card" style={{ padding: 0 }}>
              <div className="table-wrapper" style={{ border: 'none', marginTop: 0 }}>
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Role</th>
                      <th>Joined Date</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((userProfile) => (
                      <tr key={userProfile._id}>
                        <td style={{ fontWeight: 600 }}>{userProfile.name}</td>
                        <td>{userProfile.email}</td>
                        <td>{userProfile.phone}</td>
                        <td style={{ textTransform: 'capitalize' }}>
                          <span className={`badge ${userProfile.role === 'admin' ? 'badge-approved' : (userProfile.role === 'owner' ? 'badge-pending' : 'badge-cancelled')}`}>
                            {userProfile.role === 'user' ? 'Renter' : userProfile.role}
                          </span>
                        </td>
                        <td>{new Date(userProfile.createdAt).toLocaleDateString()}</td>
                        <td style={{ textAlign: 'right' }}>
                          <button 
                            onClick={() => handleDeleteUser(userProfile._id, userProfile.name)} 
                            className="btn btn-danger" 
                            style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                          >
                            Delete
                          </button>
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

export default AllUsers;
