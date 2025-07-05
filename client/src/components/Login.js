import { useState, useEffect } from 'react';
import { login } from '../auth';
import { useNavigate } from 'react-router-dom';
import { loginWithIdNumber } from '../auth';
import { useAuth } from '../authContext';
import { resetPassword } from '../auth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loginWithId, setLoginWithId] = useState(false);
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [resetMsg, setResetMsg] = useState('');

  useEffect(() => {
    if (currentUser) {
      navigate('/');
    }
  }, [currentUser, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      let result;
      if (loginWithId) {
        result = await loginWithIdNumber(idNumber, password);
        if (result && result.uid) {
          navigate('/');
        } else {
          setError('Login failed. Please check your ID number and password.');
        }
      } else {
        result = await login(email, password);
        if (result.success) {
          navigate('/');
        } else {
          setError(result.error);
        }
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setResetMsg('');
    if (!email) {
      setResetMsg('Please enter your email to reset password.');
      return;
    }
    const result = await resetPassword(email);
    if (result.success) {
      setResetMsg('Password reset email sent! Check your inbox.');
    } else {
      setResetMsg(result.error);
    }
  };

  return (
    <div className="login-container">
      <h2>Land Title System Login</h2>
      <div style={{ marginBottom: 16 }}>
        <button
          type="button"
          onClick={() => setLoginWithId(false)}
          style={{ marginRight: 8, background: !loginWithId ? '#2980b9' : '#eee', color: !loginWithId ? '#fff' : '#333', border: 'none', padding: '6px 12px', borderRadius: 4 }}
        >
          Login with Email
        </button>
        <button
          type="button"
          onClick={() => setLoginWithId(true)}
          style={{ background: loginWithId ? '#2980b9' : '#eee', color: loginWithId ? '#fff' : '#333', border: 'none', padding: '6px 12px', borderRadius: 4 }}
        >
          Login with ID Number
        </button>
      </div>
      <form onSubmit={handleLogin}>
        {loginWithId ? (
          <div>
            <label>ID Number:</label>
            <input
              type="text"
              value={idNumber}
              onChange={(e) => setIdNumber(e.target.value)}
              required
            />
          </div>
        ) : (
          <div>
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        )}
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div style={{ marginTop: 8, marginBottom: 8 }}>
          <button
            type="button"
            onClick={handleResetPassword}
            style={{
              background: 'none',
              border: 'none',
              color: '#2980b9',
              textDecoration: 'underline',
              cursor: email ? 'pointer' : 'not-allowed',
              opacity: email ? 1 : 0.5,
              padding: 0,
              font: 'inherit'
            }}
            disabled={!email}
          >
            Forgot Password?
          </button>
        </div>
        {error && <p className="error">{error}</p>}
        {resetMsg && <p className="info">{resetMsg}</p>}
        <button type="submit">Login</button>
      </form>
    </div>
  );
}