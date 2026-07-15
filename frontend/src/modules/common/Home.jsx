import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import PropertyCard from '../../components/PropertyCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import api from '../../services/api';

const Home = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useState({
    city: '',
    propertyType: '',
    minRent: '',
    maxRent: '',
    bedrooms: ''
  });

  // Fetch properties from the public browse API
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
      console.error('Error fetching property listing data:', error);
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

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProperties(searchParams);
  };

  const handleClear = () => {
    const cleared = { city: '', propertyType: '', minRent: '', maxRent: '', bedrooms: '' };
    setSearchParams(cleared);
    fetchProperties(cleared);
  };

  // Hero Section styling inline
  const heroStyle = {
    background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.95), rgba(139, 92, 246, 0.9))',
    color: 'var(--white)',
    padding: '5rem 2rem 6.5rem 2rem',
    textAlign: 'center',
    position: 'relative'
  };

  const searchBoxStyle = {
    background: 'var(--white)',
    padding: '1.5rem',
    borderRadius: 'var(--radius-lg)',
    boxShadow: 'var(--shadow-lg)',
    maxWidth: '1000px',
    margin: '-3rem auto 3rem auto',
    position: 'relative',
    zIndex: 10,
    border: '1px solid var(--slate-200)',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
    gap: '1rem',
    alignItems: 'end'
  };

  return (
    <div className="app-container">
      <Navbar />
      
      {/* Hero Section */}
      <section style={heroStyle}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '3rem', fontFamily: 'var(--font-heading)', color: '#fff', marginBottom: '1rem', lineHeight: '1.2' }}>
            Find Your Dream Home Today
          </h1>
          <p style={{ fontSize: '1.15rem', opacity: 0.9, marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem auto' }}>
            Explore verified rentals with transparent pricing, instant booking systems, and top-tier amenities.
          </p>
        </div>
      </section>

      {/* Dynamic Filter / Search box */}
      <div style={{ padding: '0 1rem' }}>
        <form style={searchBoxStyle} onSubmit={handleSearch}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">City</label>
            <input 
              type="text" 
              name="city" 
              placeholder="e.g. San Francisco" 
              value={searchParams.city} 
              onChange={handleInputChange} 
              className="form-input" 
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Type</label>
            <select name="propertyType" value={searchParams.propertyType} onChange={handleInputChange} className="form-input">
              <option value="">Any Type</option>
              <option value="Apartment">Apartment</option>
              <option value="House">House</option>
              <option value="Villa">Villa</option>
              <option value="PG">PG / Room</option>
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Min Rent</label>
            <input 
              type="number" 
              name="minRent" 
              placeholder="₹ Min" 
              value={searchParams.minRent} 
              onChange={handleInputChange} 
              className="form-input" 
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Max Rent</label>
            <input 
              type="number" 
              name="maxRent" 
              placeholder="₹ Max" 
              value={searchParams.maxRent} 
              onChange={handleInputChange} 
              className="form-input" 
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Beds</label>
            <select name="bedrooms" value={searchParams.bedrooms} onChange={handleInputChange} className="form-input">
              <option value="">Any</option>
              <option value="1">1 Bed</option>
              <option value="2">2 Beds</option>
              <option value="3">3 Beds</option>
              <option value="4">4+ Beds</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button type="submit" className="btn btn-primary" style={{ flex: 1, height: '42px' }}>
              Search
            </button>
            <button type="button" onClick={handleClear} className="btn btn-secondary" style={{ height: '42px', padding: '0 0.75rem' }}>
              Clear
            </button>
          </div>
        </form>
      </div>

      {/* Listings Section */}
      <section style={{ maxWidth: '1200px', margin: '2rem auto 5rem auto', padding: '0 1.5rem', width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.85rem' }}>Featured Listings</h2>
            <p style={{ color: 'var(--slate-500)', fontSize: '0.95rem' }}>Handpicked rental properties matching high-quality living criteria.</p>
          </div>
          <span style={{ fontSize: '0.9rem', color: 'var(--slate-500)', fontWeight: 600 }}>
            Showing {properties.length} results
          </span>
        </div>

        {loading ? (
          <LoadingSpinner fullPage={false} />
        ) : properties.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 1.5rem', background: '#fff', borderRadius: 'var(--radius-md)', border: '1px solid var(--slate-200)' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No Listings Fit Your Search</h3>
            <p style={{ color: 'var(--slate-500)', marginBottom: '1.5rem' }}>Try clearing filters to browse all available options on the platform.</p>
            <button onClick={handleClear} className="btn btn-primary">Reset Filters</button>
          </div>
        ) : (
          <div className="grid-properties">
            {properties.map(property => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>
        )}
      </section>

      {/* How it works Section */}
      <section style={{ backgroundColor: 'var(--slate-100)', padding: '5rem 2rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: '2rem', marginBottom: '3rem' }}>How HouseHunt Works</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '2.5rem' }}>
            <div style={{ textAlign: 'center', padding: '1.5rem' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'var(--primary-light)', color: 'var(--primary-base)', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 800, margin: '0 auto 1.5rem auto' }}>1</div>
              <h3 style={{ marginBottom: '0.75rem' }}>Browse Verified Listings</h3>
              <p style={{ color: 'var(--slate-600)', fontSize: '0.95rem' }}>Search and filter hundreds of properties listed directly by owners. All listings are checked for accuracy.</p>
            </div>
            <div style={{ textAlign: 'center', padding: '1.5rem' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'var(--primary-light)', color: 'var(--primary-base)', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 800, margin: '0 auto 1.5rem auto' }}>2</div>
              <h3 style={{ marginBottom: '0.75rem' }}>Submit Booking Request</h3>
              <p style={{ color: 'var(--slate-600)', fontSize: '0.95rem' }}>Send a booking request with your expected move-in date and a personal message directly to the landlord.</p>
            </div>
            <div style={{ textAlign: 'center', padding: '1.5rem' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'var(--primary-light)', color: 'var(--primary-base)', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 800, margin: '0 auto 1.5rem auto' }}>3</div>
              <h3 style={{ marginBottom: '0.75rem' }}>Move In Effortlessly</h3>
              <p style={{ color: 'var(--slate-600)', fontSize: '0.95rem' }}>Once approved, connect with the owner to arrange key exchange, sign leases, and plan your relocation.</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
