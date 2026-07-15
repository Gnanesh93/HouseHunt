import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../services/api';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please provide your email address');
      return;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please provide a valid email format');
      return;
    }

    setError('');
    setIsSubmitting(true);
    try {
      const response = await api.post('/users/forgot-password', { email });
      if (response.data && response.data.success) {
        setIsSuccess(true);
        toast.success(response.data.message || 'Recovery instructions dispatched!');
      } else {
        toast.error(response.data.message || 'Recovery request failed');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Network error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="app-container">
      <Navbar />
      <div className="auth-page">
        <div className="auth-card">
          <h2 className="auth-title">Recover Password</h2>
          
          {isSuccess ? (
            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: 'var(--success-light)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto', fontSize: '1.75rem' }}>
                ✓
              </div>
              <p style={{ color: 'var(--slate-700)', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                Password recovery link sent successfully to **{email}**. Please check your inbox and follow the instructions to reset your password.
              </p>
              <Link to="/login" className="btn btn-primary btn-block">
                Return to Sign In
              </Link>
            </div>
          ) : (
            <>
              <p className="auth-subtitle">Enter your registered email and we'll send reset instructions</p>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label" htmlFor="forgot-email">Email Address</label>
                  <input 
                    type="email" 
                    id="forgot-email"
                    placeholder="name@domain.com"
                    value={email} 
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError('');
                    }} 
                    className="form-input" 
                    style={error ? { borderColor: 'var(--error)' } : {}}
                  />
                  {error && <span style={{ color: 'var(--error)', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>{error}</span>}
                </div>

                <button type="submit" disabled={isSubmitting} className="btn btn-primary btn-block" style={{ marginTop: '1.5rem' }}>
                  {isSubmitting ? 'Sending instructions...' : 'Send Recovery Link'}
                </button>
              </form>
              <p style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--slate-500)' }}>
                Remember your password?{' '}
                <Link to="/login" style={{ color: 'var(--primary-base)', fontWeight: 600 }}>
                  Sign In
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ForgotPassword;
