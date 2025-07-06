import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../authContext';
import '../../components/GlobalStyles.css';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import AnimatedStat from '../AnimatedStat';
import './ProfilePages.css';

const CitizenProfile = () => {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const isVisible = useScrollReveal(['profile-info', 'land-records', 'activity']);

  const [formData, setFormData] = useState({
    fullname: profile?.fullname || 'John Doe',
    email: profile?.email || 'john.doe@email.com',
    phone: profile?.phone || '+254 700 123 456',
    idNumber: profile?.idNumber || '12345678',
    address: profile?.address || 'Nairobi, Kenya',
    dateOfBirth: profile?.dateOfBirth || '1985-03-15',
    occupation: profile?.occupation || 'Business Owner'
  });

  const landRecords = [
    {
      id: 'LT-2024-001',
      location: 'Nairobi, Westlands',
      size: '0.5 acres',
      status: 'Active',
      dateAcquired: '2020-05-15',
      value: 'KES 15,000,000'
    },
    {
      id: 'LT-2024-002',
      location: 'Mombasa, Nyali',
      size: '1.2 acres',
      status: 'Pending Verification',
      dateAcquired: '2023-08-20',
      value: 'KES 25,000,000'
    }
  ];

  const recentActivity = [
    {
      type: 'verification',
      title: 'Land Title Verified',
      description: 'LT-2024-001 was successfully verified',
      date: '2024-01-15',
      icon: '✅'
    },
    {
      type: 'application',
      title: 'New Title Application',
      description: 'Application submitted for LT-2024-002',
      date: '2024-01-10',
      icon: '📋'
    },
    {
      type: 'payment',
      title: 'Registration Fee Paid',
      description: 'KES 50,000 paid for title registration',
      date: '2024-01-08',
      icon: '💰'
    }
  ];

  return (
    <div className="profile-page">
      {/* Profile Header */}
      <div className="profile-header" id="profile-info">
        <div className="profile-avatar">
          <div className="avatar-circle">
            <span className="avatar-text">{formData.fullname.split(' ').map(n => n[0]).join('')}</span>
          </div>
          <div className="profile-status">
            <span className="status-dot active"></span>
            <span className="status-text">Active</span>
          </div>
        </div>
        
        <div className="profile-info">
          <h1 className="profile-name">{formData.fullname}</h1>
          <p className="profile-role">Citizen</p>
          <p className="profile-email">{formData.email}</p>
        </div>

        <div className="profile-actions">
          <Link to="/dashboard/profile/edit" className="btn btn-primary">
            Edit Profile
          </Link>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="profile-tabs">
        <button 
          className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <span className="tab-icon">📊</span>
          Overview
        </button>
        <button 
          className={`tab-button ${activeTab === 'land-records' ? 'active' : ''}`}
          onClick={() => setActiveTab('land-records')}
        >
          <span className="tab-icon">🏠</span>
          Land Records
        </button>
        <button 
          className={`tab-button ${activeTab === 'activity' ? 'active' : ''}`}
          onClick={() => setActiveTab('activity')}
        >
          <span className="tab-icon">📈</span>
          Activity
        </button>
      </div>

      {/* Profile Content */}
      <div className="profile-content">
        {activeTab === 'overview' && (
          <div className="tab-content">
            {/* Personal Information Section */}
            <div className={`content-section ${isVisible.profileInfo ? 'visible' : ''}`}>
              <div className="section-header">
                <h3>Personal Information</h3>
                <Link to="/dashboard/profile/edit" className="btn btn-secondary btn-small">
                  Edit
                </Link>
              </div>

              <div className="info-grid">
                <div className="info-item">
                  <label>Full Name</label>
                  <span>{formData.fullname}</span>
                </div>
                <div className="info-item">
                  <label>Email</label>
                  <span>{formData.email}</span>
                </div>
                <div className="info-item">
                  <label>Phone</label>
                  <span>{formData.phone}</span>
                </div>
                <div className="info-item">
                  <label>ID Number</label>
                  <span>{formData.idNumber}</span>
                </div>
                <div className="info-item">
                  <label>Date of Birth</label>
                  <span>{new Date(formData.dateOfBirth).toLocaleDateString()}</span>
                </div>
                <div className="info-item">
                  <label>Occupation</label>
                  <span>{formData.occupation}</span>
                </div>
                <div className="info-item full-width">
                  <label>Address</label>
                  <span>{formData.address}</span>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className={`content-section ${isVisible.profileInfo ? 'visible' : ''}`}>
              <h3>Quick Overview</h3>
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon">🏠</div>
                  <div className="stat-content">
                    <h4>Land Titles</h4>
                    <p className="stat-number">
                      <AnimatedStat target={landRecords.length} />
                    </p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">💰</div>
                  <div className="stat-content">
                    <h4>Total Value</h4>
                    <p className="stat-number">KES 40M</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">✅</div>
                  <div className="stat-content">
                    <h4>Verified</h4>
                    <p className="stat-number">
                      <AnimatedStat target={1} />
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'land-records' && (
          <div className="tab-content" id="land-records">
            <div className={`content-section ${isVisible.landRecords ? 'visible' : ''}`}>
              <div className="section-header">
                <h3>Land Records</h3>
                <button className="btn btn-primary btn-small">
                  Add New Record
                </button>
              </div>
              
              <div className="records-grid">
                {landRecords.map((record, index) => (
                  <div key={record.id} className="record-card">
                    <div className="record-header">
                      <div className="record-icon">🏠</div>
                      <div className="record-status">
                        <span className={`status-badge ${record.status.toLowerCase()}`}>
                          {record.status}
                        </span>
                      </div>
                    </div>
                    <div className="record-content">
                      <h4>{record.id}</h4>
                      <p className="record-location">{record.location}</p>
                      <div className="record-details">
                        <span>Size: {record.size}</span>
                        <span>Value: {record.value}</span>
                        <span>Acquired: {new Date(record.dateAcquired).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="record-actions">
                      <button className="btn btn-secondary btn-small">View Details</button>
                      <button className="btn btn-primary btn-small">Download</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="tab-content" id="activity">
            <div className={`content-section ${isVisible.activity ? 'visible' : ''}`}>
              <h3>Recent Activity</h3>
              
              <div className="activity-timeline">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="activity-item">
                    <div className="activity-icon">
                      <span>{activity.icon}</span>
                    </div>
                    <div className="activity-content">
                      <h4>{activity.title}</h4>
                      <p>{activity.description}</p>
                      <span className="activity-date">{new Date(activity.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CitizenProfile; 