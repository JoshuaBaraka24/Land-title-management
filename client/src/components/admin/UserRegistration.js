import React, { useState } from 'react';
import { register } from '../../auth';
import './UserRegistration.css';

const UserRegistration = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'citizen',
    phone: ''
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });
    
    try {
      const result = await register(
        formData.email,
        formData.password,
        formData.role,
        formData.phone
      );
      
      if (result.success) {
        setMessage({ type: 'success', text: 'User registered successfully!' });
        // Reset form
        setFormData({
          email: '',
          password: '',
          role: 'citizen',
          phone: ''
        });
      } else {
        setMessage({ type: 'error', text: `Error: ${result.error}` });
      }
    } catch (error) {
      setMessage({ type: 'error', text: `Registration failed: ${error.message}` });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="user-registration">
      <h2>Register New User</h2>
      
      {message.text && (
        <div className={`alert ${message.type}`}>
          {message.text}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email Address</label>
          <input
            type="email"
            placeholder="user@domain.com"
            required
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
        </div>
        
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            placeholder="Minimum 6 characters"
            required
            minLength={6}
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
          />
        </div>
        
        <div className="form-group">
          <label>User Role</label>
          <select
            value={formData.role}
            onChange={(e) => setFormData({...formData, role: e.target.value})}
          >
            <option value="citizen">Citizen</option>
            <option value="admin">Land Administrator</option>
            <option value="legal">Legal Officer</option>
          </select>
        </div>
        
        <div className="form-group">
          <label>Phone Number</label>
          <input
            type="tel"
            placeholder="+254700000000"
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
          />
        </div>
        
        <button 
          type="submit" 
          disabled={loading}
          className="submit-btn"
        >
          {loading ? 'Registering...' : 'Register User'}
        </button>
      </form>
    </div>
  );
};

export default UserRegistration;