import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navbar from '../../../components/Navbar';
import Sidebar from '../../../components/Sidebar';
import LoadingSpinner from '../../../components/LoadingSpinner';
import EmptyState from '../../../components/EmptyState';
import api from '../../../services/api';

const AllProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchMyProperties = async () => {
    setLoading(true);
    try {
      const response = await api.get('/owner/properties');
      if (response.data && response.data.success) {
        setProperties(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching owner properties list:', error);
      toast.error('Could not load your listings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyProperties();
  }, []);

  const handleDelete = async (id, title) => {
    if (window.confirm(`Are you sure you want to permanently delete "${title}" and all its booking histories?`)) {
      try {
        const response = await api.delete(`/owner/properties/${id}`);
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
          <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>My Properties</h1>
              <p style={{ color: 'var(--slate-500)', fontSize: '0.95rem' }}>Manage listed properties, toggle availability, or edit metadata details.</p>
            </div>
            <Link to="/owner/add-property" className="btn btn-primary">
              Add New Listing
            </Link>
          </div>

          {loading ? (
            <LoadingSpinner fullPage={false} />
          ) : properties.length === 0 ? (
            <EmptyState 
              title="No Listings Found" 
              message="You haven't listed any houses or apartments yet. Let's publish your first listing!"
              actionText="List a Property"
              onAction={() => navigate('/owner/add-property')}
            />
          ) : (
            <div className="card" style={{ padding: 0 }}>
              <div className="table-wrapper" style={{ border: 'none', marginTop: 0 }}>
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Title</th>
                      <th>Location</th>
                      <th>Rent (₹/mo)</th>
                      <th>Status</th>
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
                          <td>{property.city}, {property.state}</td>
                          <td>₹{property.rentAmount.toLocaleString()}</td>
                          <td>
                            <span className={`badge ${property.available ? 'badge-approved' : 'badge-rejected'}`}>
                              {property.available ? 'Available' : 'Rented/Unlisted'}
                            </span>
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                              <button 
                                onClick={() => navigate(`/owner/edit-property/${property._id}`)} 
                                className="btn btn-secondary" 
                                style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                              >
                                Edit
                              </button>
                              <button 
                                onClick={() => handleDelete(property._id, property.title)} 
                                className="btn btn-danger" 
                                style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                              >
                                Delete
                              </button>
                            </div>
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

export default AllProperties;
