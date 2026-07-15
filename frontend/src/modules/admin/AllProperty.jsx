import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import api from '../../services/api';

const AllProperty = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAllProperties = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/properties');
      if (response.data && response.data.success) {
        setProperties(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching admin properties:', error);
      toast.error('Could not load property records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllProperties();
  }, []);

  const handleDeleteProperty = async (id, title) => {
    if (window.confirm(`Are you sure you want to permanently delete listing "${title}"? This will also remove any tenant booking history for this property.`)) {
      try {
        const response = await api.delete(`/admin/properties/${id}`);
        if (response.data && response.data.success) {
          toast.success('Listing deleted successfully');
          setProperties(prev => prev.filter(p => p._id !== id));
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
            <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>Moderate Listed Properties</h1>
            <p style={{ color: 'var(--slate-500)', fontSize: '0.95rem' }}>View all property listings active on the marketplace and unlist/remove items.</p>
          </div>

          {loading ? (
            <LoadingSpinner fullPage={false} />
          ) : properties.length === 0 ? (
            <EmptyState 
              title="No Listings Registered" 
              message="No owners have published any property profiles yet."
            />
          ) : (
            <div className="card" style={{ padding: 0 }}>
              <div className="table-wrapper" style={{ border: 'none', marginTop: 0 }}>
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Title</th>
                      <th>City</th>
                      <th>Rent (₹/mo)</th>
                      <th>Owner Info</th>
                      <th>Availability</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {properties.map((property) => {
                      const displayImg = property.images && property.images.length > 0 
                        ? (property.images[0].startsWith('http') ? property.images[0] : `http://localhost:8000${property.images[0]}`) 
                        : 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=600&q=80';

                      return (
                        <tr key={property._id}>
                          <td>
                            <img 
                              src={displayImg} 
                              alt={property.title} 
                              style={{ width: '64px', height: '48px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
                            />
                          </td>
                          <td style={{ fontWeight: 600 }}>{property.title}</td>
                          <td>{property.city}</td>
                          <td>₹{property.rentAmount.toLocaleString()}</td>
                          <td>
                            <div style={{ fontWeight: 500 }}>{property.ownerId?.name || 'Unknown Owner'}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>{property.ownerId?.email}</div>
                          </td>
                          <td>
                            <span className={`badge ${property.available ? 'badge-approved' : 'badge-rejected'}`}>
                              {property.available ? 'Available' : 'Rented'}
                            </span>
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <button 
                              onClick={() => handleDeleteProperty(property._id, property.title)} 
                              className="btn btn-danger" 
                              style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      );
                    })}
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

export default AllProperty;
