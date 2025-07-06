import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login, resetPassword } from '../auth';
import { useAuth } from '../authContext';
import './GlobalStyles.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [resetMsg, setResetMsg] = useState('');

  useEffect(() => {
    if (currentUser) {
      navigate('/dashboard');
    }
  }, [currentUser, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const result = await login(email, password);
      if (result.success) {
        // Add a small delay for smooth transition
        setTimeout(() => {
          navigate('/dashboard');
        }, 500);
      } else {
        setError(result.error);
        setIsLoading(false);
      }
    } catch (err) {
      setError('Login failed. Please try again.');
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setResetMsg('');
    setIsResetting(true);
    
    if (!email) {
      setResetMsg('Please enter your email to reset password.');
      setIsResetting(false);
      return;
    }
    
    try {
      const result = await resetPassword(email);
      if (result.success) {
        setResetMsg('Password reset email sent! Check your inbox.');
      } else {
        setResetMsg(result.error);
      }
    } catch (err) {
      setResetMsg('Failed to send reset email. Please try again.');
    }
    
    setIsResetting(false);
  };

  const handleInputChange = (setter) => (e) => {
    setter(e.target.value);
    // Clear error when user starts typing
    if (error) setError('');
    if (resetMsg) setResetMsg('');
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h2>Welcome Back!</h2>
          <p className="login-subtitle">Sign in to your account</p>
        </div>
        
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={handleInputChange(setEmail)}
              placeholder="Enter your email"
              required
              disabled={isLoading}
            />
          </div>
          
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={handleInputChange(setPassword)}
              placeholder="Enter your password"
              required
              disabled={isLoading}
            />
          </div>
          
          <div className="forgot-password">
            <button
              type="button"
              onClick={handleResetPassword}
              disabled={!email || isLoading || isResetting}
            >
              {isResetting ? 'Sending...' : 'Forgot Password?'}
            </button>
          </div>
          
          {error && <p className="error">{error}</p>}
          {resetMsg && <p className="info">{resetMsg}</p>}
          
          <button 
            type="submit" 
            className={`login-button ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
        
        <div className="back-to-home">
          <Link to="/" className="back-link">
            ← Back to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}