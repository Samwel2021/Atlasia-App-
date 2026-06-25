import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/LoginPage.css';

const LoginPage = ({ setIsAuthenticated, setUserRole }) => {
  const [step, setStep] = useState('email'); // email, otp, or portal-selection
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [portalType, setPortalType] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRequestOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/auth/request-otp`,
        { email }
      );
      setStep('otp');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/auth/verify-otp`,
        { email, otp, portalType }
      );

      // Store token
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      setIsAuthenticated(true);
      setUserRole(portalType);

      // Navigate to appropriate portal
      navigate(`/${portalType}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to verify OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-box">
          <h1>Atlasia Logistics</h1>
          <h2>Welcome</h2>

          {error && <div className="error-message">{error}</div>}

          {step === 'email' && (
            <form onSubmit={handleRequestOTP}>
              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>
              <button type="submit" disabled={loading} className="btn btn-primary">
                {loading ? 'Sending...' : 'Send Verification Code'}
              </button>
            </form>
          )}

          {step === 'otp' && (
            <form onSubmit={handleVerifyOTP}>
              <div className="form-group">
                <label>Verification Code</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter 6-digit OTP"
                  maxLength="6"
                  required
                />
                <small>Code sent to {email}</small>
              </div>

              <div className="form-group">
                <label>Portal Type</label>
                <select
                  value={portalType}
                  onChange={(e) => setPortalType(e.target.value)}
                  required
                >
                  <option value="">Select your role</option>
                  <option value="admin">Admin</option>
                  <option value="customer">Customer</option>
                  <option value="transporter">Transporter</option>
                </select>
              </div>

              <button type="submit" disabled={loading || !portalType} className="btn btn-primary">
                {loading ? 'Verifying...' : 'Verify & Login'}
              </button>

              <button
                type="button"
                onClick={() => setStep('email')}
                className="btn btn-secondary"
              >
                Back
              </button>
            </form>
          )}

          <p className="signup-link">
            New user? <a href="/">Go to Home</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
