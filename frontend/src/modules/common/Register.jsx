import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const Register = () => {
  const { register, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'user', // default: renter
    address: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If user is already authenticated, redirect them automatically
  useEffect(() => {
    if (user) {
      if (user.role === 'admin') navigate('/admin/dashboard');
      else if (user.role === 'owner') navigate('/owner/dashboard');
      else navigate('/user/home');
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const errors = {};
    if (!formData.name) errors.name = 'Full name is required';
    if (!formData.email) {
      errors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please provide a valid email format';
    }
    if (!formData.phone) {
      errors.phone = 'Phone number is required';
    } else if (!/^\d{10,15}$/.test(formData.phone)) {
      errors.phone = 'Phone number must be between 10 and 15 digits';
    }
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters long';
    }
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);
    const { confirmPassword, ...registerPayload } = formData;
    const result = await register(registerPayload);
    setIsSubmitting(false);

    if (result.success) {
      toast.success('Registration completed successfully! Welcome to HouseHunt.');
      if (result.user.role === 'owner') {
        navigate('/owner/dashboard');
      } else {
        navigate('/user/home');
      }
    } else {
      toast.error(result.error);
    }
  };

  return (
    <div className="app-container">
      <Navbar />
      <div className="auth-page">
        <div className="auth-card" style={{ maxWidth: '550px' }}>
          <h2 className="auth-title">Create Account</h2>
          <p className="auth-subtitle">Join HouseHunt to find or list rental properties</p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="register-name">Full Name</label>
              <input 
                type="text" 
                id="register-name"
                name="name" 
                value={formData.name} 
                onChange={handleInputChange} 
                className="form-input" 
                style={formErrors.name ? { borderColor: 'var(--error)' } : {}}
              />
              {formErrors.name && <span style={{ color: 'var(--error)', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>{formErrors.name}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="register-email">Email Address</label>
                <input 
                  type="email" 
                  id="register-email"
                  name="email" 
                  value={formData.email} 
                  onChange={handleInputChange} 
                  className="form-input" 
                  style={formErrors.email ? { borderColor: 'var(--error)' } : {}}
                />
                {formErrors.email && <span style={{ color: 'var(--error)', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>{formErrors.email}</span>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="register-phone">Phone Number</label>
                <input 
                  type="text" 
                  id="register-phone"
                  name="phone" 
                  placeholder="10-digit number"
                  value={formData.phone} 
                  onChange={handleInputChange} 
                  className="form-input" 
                  style={formErrors.phone ? { borderColor: 'var(--error)' } : {}}
                />
                {formErrors.phone && <span style={{ color: 'var(--error)', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>{formErrors.phone}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="register-password">Password</label>
                <input 
                  type="password" 
                  id="register-password"
                  name="password" 
                  value={formData.password} 
                  onChange={handleInputChange} 
                  className="form-input" 
                  style={formErrors.password ? { borderColor: 'var(--error)' } : {}}
                />
                {formErrors.password && <span style={{ color: 'var(--error)', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>{formErrors.password}</span>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="register-confirm">Confirm Password</label>
                <input 
                  type="password" 
                  id="register-confirm"
                  name="confirmPassword" 
                  value={formData.confirmPassword} 
                  onChange={handleInputChange} 
                  className="form-input" 
                  style={formErrors.confirmPassword ? { borderColor: 'var(--error)' } : {}}
                />
                {formErrors.confirmPassword && <span style={{ color: 'var(--error)', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>{formErrors.confirmPassword}</span>}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">I want to...</label>
              <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.5rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 500 }}>
                  <input 
                    type="radio" 
                    name="role" 
                    value="user" 
                    checked={formData.role === 'user'} 
                    onChange={handleInputChange}
                    style={{ accentColor: 'var(--primary-base)' }}
                  />
                  <span>Rent a House</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 500 }}>
                  <input 
                    type="radio" 
                    name="role" 
                    value="owner" 
                    checked={formData.role === 'owner'} 
                    onChange={handleInputChange}
                    style={{ accentColor: 'var(--primary-base)' }}
                  />
                  <span>List/Own Properties</span>
                </label>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="register-address">Address (Optional)</label>
              <textarea 
                id="register-address"
                name="address" 
                rows="2" 
                value={formData.address} 
                onChange={handleInputChange} 
                className="form-input"
                style={{ resize: 'none' }}
              />
            </div>

            <button type="submit" disabled={isSubmitting} className="btn btn-primary btn-block" style={{ marginTop: '1rem' }}>
              {isSubmitting ? 'Registering Account...' : 'Sign Up'}
            </button>
          </form>

          <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--slate-500)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--primary-base)', fontWeight: 600 }}>
              Sign In
            </Link>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Register;
