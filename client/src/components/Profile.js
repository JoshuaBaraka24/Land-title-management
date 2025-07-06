import React, { useState } from 'react';
import { useAuth } from '../authContext';
import './GlobalStyles.css';
import './Profile.css';

const Profile = () => {
  const { currentUser, profile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullname: profile?.fullname || '',
    email: profile?.email || '',
    phone: profile?.phone || '',
    idNumber: profile?.idNumber || '',
    address: profile?.address || ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement profile update logic
    console.log('Profile update:', formData);
    setIsEditing(false);
  };

  const renderCitizenProfile = () => (
    <div className="profile-section">
      <h3>Land Records</h3>
      <div className="land-records">
        <div className="record-item">
          <div className="record-icon">🏠</div>
          <div className="record-details">
            <h4>Land Title #LT-2024-001</h4>
            <p>Location: Nairobi, Westlands</p>
            <p>Size: 0.5 acres</p>
            <p>Status: Active</p>
          </div>
        </div>
        <div className="record-item">
          <div className="record-icon">🏠</div>
          <div className="record-details">
            <h4>Land Title #LT-2024-002</h4>
            <p>Location: Mombasa, Nyali</p>
            <p>Size: 1.2 acres</p>
            <p>Status: Pending Verification</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAdminProfile = () => (
    <div className="profile-section">
      <h3>Administrative Overview</h3>
      <div className="admin-stats">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h4>Total Users</h4>
            <p className="stat-number">1,247</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📋</div>
          <div className="stat-content">
            <h4>Land Titles</h4>
            <p className="stat-number">50,432</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⚖️</div>
          <div className="stat-content">
            <h4>Active Disputes</h4>
            <p className="stat-number">23</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h4>Verified Today</h4>
            <p className="stat-number">156</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderLegalProfile = () => (
    <div className="profile-section">
      <h3>Legal Cases</h3>
      <div className="legal-cases">
        <div className="case-item">
          <div className="case-icon">⚖️</div>
          <div className="case-details">
            <h4>Case #LC-2024-001</h4>
            <p>Dispute Type: Boundary Dispute</p>
            <p>Status: Under Review</p>
            <p>Parties: John Doe vs Jane Smith</p>
          </div>
        </div>
        <div className="case-item">
          <div className="case-icon">⚖️</div>
          <div className="case-details">
            <h4>Case #LC-2024-002</h4>
            <p>Dispute Type: Ownership Dispute</p>
            <p>Status: Scheduled for Hearing</p>
            <p>Parties: ABC Company vs XYZ Ltd</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h2>My Profile</h2>
        <button 
          onClick={() => setIsEditing(!isEditing)} 
          className="btn btn-secondary"
        >
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>

      <div className="profile-content">
        {/* Personal Information */}
        <div className="profile-section">
          <h3>Personal Information</h3>
          {isEditing ? (
            <form onSubmit={handleSubmit} className="profile-form">
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="fullname"
                  value={formData.fullname}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>ID Number</label>
                <input
                  type="text"
                  name="idNumber"
                  value={formData.idNumber}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Address</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="form-input"
                  rows="3"
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  Save Changes
                </button>
                <button 
                  type="button" 
                  onClick={() => setIsEditing(false)} 
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="profile-info">
              <div className="info-item">
                <label>Full Name:</label>
                <span>{profile?.fullname || 'Not provided'}</span>
              </div>
              <div className="info-item">
                <label>Email:</label>
                <span>{profile?.email || 'Not provided'}</span>
              </div>
              <div className="info-item">
                <label>Phone:</label>
                <span>{profile?.phone || 'Not provided'}</span>
              </div>
              <div className="info-item">
                <label>ID Number:</label>
                <span>{profile?.idNumber || 'Not provided'}</span>
              </div>
              <div className="info-item">
                <label>Address:</label>
                <span>{profile?.address || 'Not provided'}</span>
              </div>
              <div className="info-item">
                <label>Role:</label>
                <span className="role-badge">{profile?.role || 'Unknown'}</span>
              </div>
            </div>
          )}
        </div>

        {/* Role-specific content */}
        {profile?.role === 'citizen' && renderCitizenProfile()}
        {profile?.role === 'admin' && renderAdminProfile()}
        {profile?.role === 'legal' && renderLegalProfile()}

        {/* Account Security */}
        <div className="profile-section">
          <h3>Account Security</h3>
          <div className="security-options">
            <button className="btn btn-secondary">
              Change Password
            </button>
            <button className="btn btn-secondary">
              Enable Two-Factor Authentication
            </button>
            <button className="btn btn-secondary">
              View Login History
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 