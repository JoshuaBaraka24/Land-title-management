import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../authContext';
import '../../components/GlobalStyles.css';
import './ProfilePages.css';

const EditLegalProfile = () => {
  const { profile, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateMessage, setUpdateMessage] = useState('');
  
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    phone: '',
    idNumber: '',
    address: '',
    specialization: '',
    barNumber: '',
    experience: ''
  });

  // Load profile data when component mounts
  useEffect(() => {
    if (profile) {
      setFormData({
        fullname: profile.fullname || '',
        email: profile.email || '',
        phone: profile.phone || '',
        idNumber: profile.idNumber || '',
        address: profile.address || '',
        specialization: profile.specialization || '',
        barNumber: profile.barNumber || '',
        experience: profile.experience || ''
      });
    }
  }, [profile]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    setUpdateMessage('');
    
    try {
      const result = await updateProfile(formData);
      
      if (result.success) {
        setUpdateMessage('Profile updated successfully!');
        setTimeout(() => {
          navigate('/dashboard/profile');
        }, 1500);
      } else {
        setUpdateMessage(`Error: ${result.error}`);
      }
    } catch (error) {
      setUpdateMessage(`Error: ${error.message}`);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancel = () => {
    navigate('/dashboard/profile');
  };

  return (
    <div className="profile-page">
      {/* Header */}
      <div className="edit-profile-header">
        <div className="header-content">
          <h1 className="edit-title">Edit Legal Officer Profile</h1>
          <p className="edit-subtitle">Update your legal information</p>
        </div>
        <div className="header-actions">
          <button 
            onClick={handleCancel} 
            className="btn btn-secondary"
            disabled={isUpdating}
          >
            Cancel
          </button>
        </div>
      </div>

      {/* Update Message */}
      {updateMessage && (
        <div className={`update-message ${updateMessage.includes('Error') ? 'error' : 'success'}`}>
          {updateMessage}
        </div>
      )}

      {/* Edit Form */}
      <div className="edit-form-container">
        <form onSubmit={handleSubmit} className="edit-profile-form">
          <div className="form-section">
            <h3>Personal Information</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  name="fullname"
                  value={formData.fullname}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <label>Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <label>Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <label>ID Number *</label>
                <input
                  type="text"
                  name="idNumber"
                  value={formData.idNumber}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Legal Information</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Bar Number *</label>
                <input
                  type="text"
                  name="barNumber"
                  value={formData.barNumber}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <label>Specialization *</label>
                <input
                  type="text"
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="e.g., Land Law, Civil Law"
                  required
                />
              </div>
              <div className="form-group">
                <label>Years of Experience *</label>
                <input
                  type="text"
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="e.g., 8 years"
                  required
                />
              </div>
            </div>
            <div className="form-group full-width">
              <label>Address</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="form-input"
                rows="4"
                placeholder="Enter your full address..."
              />
            </div>
          </div>

          <div className="form-actions">
            <button 
              type="submit" 
              className="btn btn-primary btn-large"
              disabled={isUpdating}
            >
              {isUpdating ? 'Saving Changes...' : 'Save Changes'}
            </button>
            <button 
              type="button" 
              onClick={handleCancel} 
              className="btn btn-secondary btn-large"
              disabled={isUpdating}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditLegalProfile; 