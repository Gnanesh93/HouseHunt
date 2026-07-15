import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navbar from '../../../components/Navbar';
import Sidebar from '../../../components/Sidebar';
import LoadingSpinner from '../../../components/LoadingSpinner';
import api from '../../../services/api';

const AddProperty = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Used for Edit mode if ID exists
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    propertyType: 'Apartment',
    listingType: 'Rent',
    rentAmount: '',
    securityDeposit: '',
    city: '',
    state: '',
    address: '',
    pincode: '',
    bedrooms: '',
    bathrooms: '',
    furnishing: 'unfurnished',
    available: true
  });

  const [amenities, setAmenities] = useState({
    WiFi: false,
    Parking: false,
    AC: false,
    Gym: false,
    Pool: false,
    Security: false
  });

  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [replaceImages, setReplaceImages] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (isEditMode) {
      const fetchProperty = async () => {
        setLoading(true);
        try {
          const response = await api.get(`/users/properties/${id}`);
          if (response.data && response.data.success) {
            const property = response.data.data;
            setFormData({
              title: property.title,
              description: property.description,
              propertyType: property.propertyType,
              listingType: property.listingType,
              rentAmount: property.rentAmount,
              securityDeposit: property.securityDeposit,
              city: property.city,
              state: property.state,
              address: property.address,
              pincode: property.pincode,
              bedrooms: property.bedrooms,
              bathrooms: property.bathrooms,
              furnishing: property.furnishing,
              available: property.available
            });
            // Pre-populate amenities map
            const amMap = { WiFi: false, Parking: false, AC: false, Gym: false, Pool: false, Security: false };
            property.amenities.forEach(item => {
              if (amMap[item] !== undefined) amMap[item] = true;
            });
            setAmenities(amMap);
            setExistingImages(property.images);
          }
        } catch (error) {
          toast.error('Error retrieving property data');
          navigate('/owner/properties');
        } finally {
          setLoading(false);
        }
      };
      fetchProperty();
    }
  }, [id, isEditMode]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleAmenityChange = (e) => {
    const { name, checked } = e.target;
    setAmenities(prev => ({ ...prev, [name]: checked }));
  };

  const handleFileChange = (e) => {
    setImages(Array.from(e.target.files));
  };

  const validate = () => {
    const errors = {};
    if (!formData.title) errors.title = 'Title is required';
    if (!formData.description) errors.description = 'Description is required';
    if (!formData.rentAmount || parseFloat(formData.rentAmount) <= 0) {
      errors.rentAmount = 'Valid rent amount is required';
    }
    if (!formData.securityDeposit || parseFloat(formData.securityDeposit) <= 0) {
      errors.securityDeposit = 'Valid security deposit is required';
    }
    if (!formData.city) errors.city = 'City is required';
    if (!formData.state) errors.state = 'State is required';
    if (!formData.address) errors.address = 'Address is required';
    if (!formData.pincode) {
      errors.pincode = 'Pincode is required';
    } else if (!/^\d{5,8}$/.test(formData.pincode)) {
      errors.pincode = 'Pincode must be between 5 and 8 digits';
    }
    if (!formData.bedrooms || parseInt(formData.bedrooms, 10) < 0) {
      errors.bedrooms = 'Bedrooms count is required';
    }
    if (!formData.bathrooms || parseInt(formData.bathrooms, 10) < 0) {
      errors.bathrooms = 'Bathrooms count is required';
    }
    if (!isEditMode && images.length === 0) {
      errors.images = 'Please select at least one property image';
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast.error('Please correct the validation errors in the form.');
      return;
    }

    const payload = new FormData();
    // Append standard fields
    Object.keys(formData).forEach(key => {
      payload.append(key, formData[key]);
    });

    // Append active amenities
    const activeAmenities = Object.keys(amenities).filter(key => amenities[key]);
    payload.append('amenities', JSON.stringify(activeAmenities));

    // Append image files
    images.forEach(img => {
      payload.append('images', img);
    });

    if (isEditMode) {
      payload.append('replaceImages', replaceImages);
    }

    setLoading(true);
    try {
      let response;
      if (isEditMode) {
        response = await api.put(`/owner/properties/${id}`, payload, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        response = await api.post('/owner/properties', payload, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      if (response.data && response.data.success) {
        toast.success(isEditMode ? 'Listing updated successfully!' : 'Listing created successfully!');
        navigate('/owner/properties');
      } else {
        toast.error(response.data.message || 'Operation failed');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Network error occurred during listing operation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <Navbar />
      <div className="dashboard-layout">
        <Sidebar />
        <main className="dashboard-main">
          <div style={{ marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>
              {isEditMode ? 'Edit Property Listing' : 'List New Property'}
            </h1>
            <p style={{ color: 'var(--slate-500)', fontSize: '0.95rem' }}>
              Configure property specifications, rental price, and upload listing images.
            </p>
          </div>

          {loading && isEditMode ? (
            <LoadingSpinner fullPage={false} />
          ) : (
            <div className="card">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Property Title *</label>
                  <input 
                    type="text" 
                    name="title" 
                    placeholder="e.g. Cozy 2BHK Apartment near Central Park" 
                    value={formData.title} 
                    onChange={handleInputChange} 
                    className="form-input" 
                    style={formErrors.title ? { borderColor: 'var(--error)' } : {}}
                  />
                  {formErrors.title && <span style={{ color: 'var(--error)', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>{formErrors.title}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">Description *</label>
                  <textarea 
                    name="description" 
                    rows="4" 
                    placeholder="Describe the property layout, location perks, policies..." 
                    value={formData.description} 
                    onChange={handleInputChange} 
                    className="form-input"
                    style={{ resize: 'none', ...(formErrors.description ? { borderColor: 'var(--error)' } : {}) }}
                  />
                  {formErrors.description && <span style={{ color: 'var(--error)', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>{formErrors.description}</span>}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem', marginBottom: '1.25rem' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Property Type</label>
                    <select name="propertyType" value={formData.propertyType} onChange={handleInputChange} className="form-input">
                      <option value="Apartment">Apartment</option>
                      <option value="House">House</option>
                      <option value="Villa">Villa</option>
                      <option value="PG">PG</option>
                    </select>
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Listing Type</label>
                    <select name="listingType" value={formData.listingType} onChange={handleInputChange} className="form-input">
                      <option value="Rent">Rent</option>
                      <option value="Lease">Lease</option>
                    </select>
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Furnishing Status</label>
                    <select name="furnishing" value={formData.furnishing} onChange={handleInputChange} className="form-input">
                      <option value="unfurnished">Unfurnished</option>
                      <option value="semi-furnished">Semi-Furnished</option>
                      <option value="fully-furnished">Fully-Furnished</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Rent Amount (₹/mo) *</label>
                    <input 
                      type="number" 
                      name="rentAmount" 
                      placeholder="1200" 
                      value={formData.rentAmount} 
                      onChange={handleInputChange} 
                      className="form-input" 
                      style={formErrors.rentAmount ? { borderColor: 'var(--error)' } : {}}
                    />
                    {formErrors.rentAmount && <span style={{ color: 'var(--error)', fontSize: '0.8rem', display: 'block' }}>{formErrors.rentAmount}</span>}
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Security Deposit (₹) *</label>
                    <input 
                      type="number" 
                      name="securityDeposit" 
                      placeholder="2000" 
                      value={formData.securityDeposit} 
                      onChange={handleInputChange} 
                      className="form-input" 
                      style={formErrors.securityDeposit ? { borderColor: 'var(--error)' } : {}}
                    />
                    {formErrors.securityDeposit && <span style={{ color: 'var(--error)', fontSize: '0.8rem', display: 'block' }}>{formErrors.securityDeposit}</span>}
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Bedrooms *</label>
                    <input 
                      type="number" 
                      name="bedrooms" 
                      placeholder="2" 
                      value={formData.bedrooms} 
                      onChange={handleInputChange} 
                      className="form-input" 
                      style={formErrors.bedrooms ? { borderColor: 'var(--error)' } : {}}
                    />
                    {formErrors.bedrooms && <span style={{ color: 'var(--error)', fontSize: '0.8rem', display: 'block' }}>{formErrors.bedrooms}</span>}
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Bathrooms *</label>
                    <input 
                      type="number" 
                      name="bathrooms" 
                      placeholder="2" 
                      value={formData.bathrooms} 
                      onChange={handleInputChange} 
                      className="form-input" 
                      style={formErrors.bathrooms ? { borderColor: 'var(--error)' } : {}}
                    />
                    {formErrors.bathrooms && <span style={{ color: 'var(--error)', fontSize: '0.8rem', display: 'block' }}>{formErrors.bathrooms}</span>}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 2fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">City *</label>
                    <input 
                      type="text" 
                      name="city" 
                      value={formData.city} 
                      onChange={handleInputChange} 
                      className="form-input" 
                      style={formErrors.city ? { borderColor: 'var(--error)' } : {}}
                    />
                    {formErrors.city && <span style={{ color: 'var(--error)', fontSize: '0.8rem', display: 'block' }}>{formErrors.city}</span>}
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">State *</label>
                    <input 
                      type="text" 
                      name="state" 
                      value={formData.state} 
                      onChange={handleInputChange} 
                      className="form-input" 
                      style={formErrors.state ? { borderColor: 'var(--error)' } : {}}
                    />
                    {formErrors.state && <span style={{ color: 'var(--error)', fontSize: '0.8rem', display: 'block' }}>{formErrors.state}</span>}
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Street Address *</label>
                    <input 
                      type="text" 
                      name="address" 
                      value={formData.address} 
                      onChange={handleInputChange} 
                      className="form-input" 
                      style={formErrors.address ? { borderColor: 'var(--error)' } : {}}
                    />
                    {formErrors.address && <span style={{ color: 'var(--error)', fontSize: '0.8rem', display: 'block' }}>{formErrors.address}</span>}
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Pincode *</label>
                    <input 
                      type="text" 
                      name="pincode" 
                      value={formData.pincode} 
                      onChange={handleInputChange} 
                      className="form-input" 
                      style={formErrors.pincode ? { borderColor: 'var(--error)' } : {}}
                    />
                    {formErrors.pincode && <span style={{ color: 'var(--error)', fontSize: '0.8rem', display: 'block' }}>{formErrors.pincode}</span>}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Amenities</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', marginTop: '0.5rem' }}>
                    {Object.keys(amenities).map(key => (
                      <label key={key} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 500 }}>
                        <input 
                          type="checkbox" 
                          name={key} 
                          checked={amenities[key]} 
                          onChange={handleAmenityChange}
                          style={{ accentColor: 'var(--primary-base)' }}
                        />
                        <span>{key}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {isEditMode && existingImages.length > 0 && (
                  <div className="form-group">
                    <label className="form-label">Existing Images</label>
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                      {existingImages.map((img, idx) => (
                        <img 
                          key={idx} 
                          src={img.startsWith('http') ? img : `http://localhost:8000${img}`} 
                          alt="preview" 
                          style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} 
                        />
                      ))}
                    </div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem', cursor: 'pointer', fontWeight: 600 }}>
                      <input 
                        type="checkbox" 
                        checked={replaceImages} 
                        onChange={(e) => setReplaceImages(e.target.checked)} 
                        style={{ accentColor: 'var(--primary-base)' }}
                      />
                      <span>Replace existing images with new uploads</span>
                    </label>
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label">Upload Listing Images *</label>
                  <input 
                    type="file" 
                    multiple 
                    accept="image/*" 
                    onChange={handleFileChange} 
                    className="form-input" 
                    style={formErrors.images ? { borderColor: 'var(--error)' } : {}}
                  />
                  {formErrors.images && <span style={{ color: 'var(--error)', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>{formErrors.images}</span>}
                  <p style={{ fontSize: '0.75rem', color: 'var(--slate-500)', marginTop: '0.25rem' }}>Select up to 5 images. Files must be under 5MB each.</p>
                </div>

                {isEditMode && (
                  <div className="form-group">
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 600 }}>
                      <input 
                        type="checkbox" 
                        name="available" 
                        checked={formData.available} 
                        onChange={handleInputChange} 
                        style={{ accentColor: 'var(--primary-base)' }}
                      />
                      <span>Property is available for booking</span>
                    </label>
                  </div>
                )}

                <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                  <button type="submit" disabled={loading} className="btn btn-primary" style={{ flex: 1 }}>
                    {loading ? 'Processing...' : (isEditMode ? 'Update Property Listing' : 'Publish Property Listing')}
                  </button>
                  <button type="button" onClick={() => navigate('/owner/properties')} className="btn btn-secondary" style={{ width: '150px' }}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AddProperty;
