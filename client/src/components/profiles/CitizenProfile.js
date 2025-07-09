import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../authContext';
import '../../components/GlobalStyles.css';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import './ProfilePages.css';

const CitizenProfile = () => {
  const { profile, currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('land-records');
  const isVisible = useScrollReveal(['profile-info', 'land-records']);

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
          <p className="profile-email">{formData.email}</p>
        </div>

        <div className="profile-actions">
          <Link to="/dashboard/profile/edit" className="btn btn-primary">
            Edit Profile
          </Link>
        </div>
      </div>

      {/* Profile Content */}
      <div className="profile-content">

        {/* The following block was removed as per the edit hint */}
        {/*
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
        */}


      </div>
    </div>
  );
};

export default CitizenProfile; 