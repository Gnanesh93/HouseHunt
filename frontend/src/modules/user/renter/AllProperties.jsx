import React, { useState, useEffect } from 'react';
import Navbar from '../../../components/Navbar';
import Sidebar from '../../../components/Sidebar';
import PropertyCard from '../../../components/PropertyCard';
import LoadingSpinner from '../../../components/LoadingSpinner';
import api from '../../../services/api';

const AllProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useState({
    city: '',
    propertyType: '',
    minRent: '',
    maxRent: '',
    bedrooms: '',
    furnishing: '',
    search: ''
  });

  const fetchProperties = async (filters = {}) => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          queryParams.append(key, filters[key]);
        }
      });
      const response = await api.get(`/users/properties?${queryParams.toString()}`);
      if (response.data && response.data.success) {
        setProperties(response.data.data);
      }
    } catch (error) {
      console.error('Error loading properties catalog:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({ ...prev, [name]: value }));
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProperties(searchParams);
  };

  const handleReset = () => {
    const cleared = { city: '', propertyType: '', minRent: '', maxRent: '', bedrooms: '', furnishing: '', search: '' };
    setSearchParams(cleared);
    fetchProperties(cleared);
  };

  return (
    <div className="app-container">
      <Navbar />
      <div className="dashboard-layout">
        <Sidebar />
        <main className="dashboard-main">
          <div style={{ marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>Browse Properties</h1>
            <p style={{ color: 'var(--slate-500)', fontSize: '0.95rem' }}>Search and discover available rental listings on HouseHunt.</p>
          </div>

          {/* Detailed Search Filters */}
          <div className="card" style={{ marginBottom: '2rem' }}>
            <form onSubmit={handleSearchSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Search Keywords</label>
                  <input 
                    type="text" 
                    name="search" 
                    placeholder="e.g. Cozy, Downtown..." 
                    value={searchParams.search} 
                    onChange={handleInputChange} 
                    className="form-input" 
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">City</label>
                  <input 
                    type="text" 
                    name="city" 
                    placeholder="e.g. Los Angeles" 
                    value={searchParams.city} 
                    onChange={handleInputChange} 
                    className="form-input" 
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Property Type</label>
                  <select name="propertyType" value={searchParams.propertyType} onChange={handleInputChange} className="form-input">
                    <option value="">Any Type</option>
                    <option value="Apartment">Apartment</option>
                    <option value="House">House</option>
                    <option value="Villa">Villa</option>
                    <option value="PG">PG</option>
                  </select>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Bedrooms</label>
                  <select name="bedrooms" value={searchParams.bedrooms} onChange={handleInputChange} className="form-input">
                    <option value="">Any</option>
                    <option value="1">1 Bed</option>
                    <option value="2">2 Beds</option>
                    <option value="3">3 Beds</option>
                    <option value="4">4+ Beds</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', alignItems: 'end' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Min Rent (₹)</label>
                  <input 
                    type="number" 
                    name="minRent" 
                    placeholder="Min" 
                    value={searchParams.minRent} 
                    onChange={handleInputChange} 
                    className="form-input" 
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Max Rent (₹)</label>
                  <input 
                    type="number" 
                    name="maxRent" 
                    placeholder="Max" 
                    value={searchParams.maxRent} 
                    onChange={handleInputChange} 
                    className="form-input" 
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Furnishing</label>
                  <select name="furnishing" value={searchParams.furnishing} onChange={handleInputChange} className="form-input">
                    <option value="">Any Furnishing</option>
                    <option value="unfurnished">Unfurnished</option>
                    <option value="semi-furnished">Semi-Furnished</option>
                    <option value="fully-furnished">Fully-Furnished</option>
                  </select>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button type="submit" className="btn btn-primary" style={{ flex: 1, height: '42px' }}>
                    Apply Filters
                  </button>
                  <button type="button" onClick={handleReset} className="btn btn-secondary" style={{ height: '42px' }}>
                    Reset
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Grid layout */}
          {loading ? (
            <LoadingSpinner fullPage={false} />
          ) : properties.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 1.5rem', background: '#fff', borderRadius: 'var(--radius-md)', border: '1px solid var(--slate-200)' }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No Listings Found</h3>
              <p style={{ color: 'var(--slate-500)', marginBottom: '1.5rem' }}>Try relaxing your search options to find more properties.</p>
              <button onClick={handleReset} className="btn btn-primary">Clear Search Filters</button>
            </div>
          ) : (
            <div className="grid-properties">
              {properties.map(property => (
                <PropertyCard key={property._id} property={property} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AllProperties;
