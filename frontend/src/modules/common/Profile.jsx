import React, { useState, useContext } from 'react';
import { toast } from 'react-toastify';
import { AuthContext } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const Profile = () => {
  const { user, updateProfile } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || ''
  });
  const [passwordData, setPasswordData] = useState({ password: '', confirmPassword: '' });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const errors = {};
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }
    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (formData.phone.trim().length < 10) {
      errors.phone = 'Phone number must be at least 10 digits';
    }
    if (passwordData.password || passwordData.confirmPassword) {
      if (passwordData.password.length < 6) {
        errors.password = 'Password must be at least 6 characters';
      }
      if (passwordData.password !== passwordData.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
      }
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const payload = {
        name: formData.name,
        phone: formData.phone,
        address: formData.address
      };
      if (passwordData.password) {
        payload.password = passwordData.password;
      }

      const result = await updateProfile(payload);
      if (result.success) {
        toast.success('Profile updated successfully!');
        setPasswordData({ password: '', confirmPassword: '' });
      } else {
        toast.error(result.error || 'Failed to update profile');
      }
    } catch (error) {
      toast.error('An unexpected error occurred while updating your profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) return null;

  return (
    <div className="app-container">
      <Navbar />
      <div className="auth-page" style={{ alignItems: 'flex-start', paddingTop: '3rem' }}>
        <div className="auth-card" style={{ maxWidth: '560px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '1.5rem' }}>
            {user.profileImage ? (
              <img
                src={user.profileImage}
                alt={user.name}
                style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', marginBottom: '0.75rem' }}
              />
            ) : (
              <div
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--primary-light)',
                  color: 'var(--primary-base)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '2rem',
                  marginBottom: '0.75rem'
                }}
              >
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
            <span className="badge badge-approved" style={{ textTransform: 'capitalize' }}>
              {user.role === 'user' ? 'Renter' : user.role}
            </span>
          </div>

          <h2 className="auth-title">My Profile</h2>
          <p className="auth-subtitle">Manage your personal account information</p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input type="email" className="form-input" value={user.email} disabled style={{ backgroundColor: 'var(--slate-100)', cursor: 'not-allowed' }} />
            </div>

            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                name="name"
                className="form-input"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
              />
              {formErrors.name && <p style={{ color: 'var(--error)', fontSize: '0.8rem', marginTop: '0.35rem' }}>{formErrors.name}</p>}
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="text"
                name="phone"
                className="form-input"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Enter your phone number"
              />
              {formErrors.phone && <p style={{ color: 'var(--error)', fontSize: '0.8rem', marginTop: '0.35rem' }}>{formErrors.phone}</p>}
            </div>

            <div className="form-group">
              <label className="form-label">Address</label>
              <input
                type="text"
                name="address"
                className="form-input"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Enter your address"
              />
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid var(--slate-200)', margin: '1.5rem 0' }} />

            <p style={{ fontWeight: 600, color: 'var(--slate-700)', marginBottom: '1rem', fontSize: '0.9rem' }}>
              Change Password (optional)
            </p>

            <div className="form-group">
              <label className="form-label">New Password</label>
              <input
                type="password"
                name="password"
                className="form-input"
                value={passwordData.password}
                onChange={handlePasswordChange}
                placeholder="Leave blank to keep current password"
              />
              {formErrors.password && <p style={{ color: 'var(--error)', fontSize: '0.8rem', marginTop: '0.35rem' }}>{formErrors.password}</p>}
            </div>

            <div className="form-group">
              <label className="form-label">Confirm New Password</label>
              <input
                type="password"
                name="confirmPassword"
                className="form-input"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                placeholder="Re-enter new password"
              />
              {formErrors.confirmPassword && <p style={{ color: 'var(--error)', fontSize: '0.8rem', marginTop: '0.35rem' }}>{formErrors.confirmPassword}</p>}
            </div>

            <button type="submit" className="btn btn-primary btn-block" disabled={isSubmitting}>
              {isSubmitting ? 'Saving Changes...' : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;
