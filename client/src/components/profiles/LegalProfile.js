import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../authContext';
import '../../components/GlobalStyles.css';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import AnimatedStat from '../AnimatedStat';
import './ProfilePages.css';

const LegalProfile = () => {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const isVisible = useScrollReveal(['profile-info', 'cases', 'activity']);

  const [formData, setFormData] = useState({
    fullname: profile?.fullname || 'Legal Officer',
    email: profile?.email || 'legal@landtitle.ke',
    phone: profile?.phone || '+254 700 000 001',
    idNumber: profile?.idNumber || 'LEGAL001',
    address: profile?.address || 'Nairobi, Kenya',
    specialization: profile?.specialization || 'Land Law',
    barNumber: profile?.barNumber || 'BAR001',
    experience: profile?.experience || '8 years'
  });

  const legalCases = [
    {
      id: 'LC-2024-001',
      title: 'Boundary Dispute Resolution',
      parties: 'John Doe vs Jane Smith',
      status: 'Under Review',
      priority: 'High',
      dateFiled: '2024-01-10',
      nextHearing: '2024-01-25',
      type: 'Boundary Dispute'
    },
    {
      id: 'LC-2024-002',
      title: 'Ownership Dispute',
      parties: 'ABC Company vs XYZ Ltd',
      status: 'Scheduled for Hearing',
      priority: 'Medium',
      dateFiled: '2024-01-05',
      nextHearing: '2024-02-01',
      type: 'Ownership Dispute'
    },
    {
      id: 'LC-2024-003',
      title: 'Inheritance Dispute',
      parties: 'Family Estate vs Heirs',
      status: 'Mediation',
      priority: 'Low',
      dateFiled: '2024-01-08',
      nextHearing: '2024-01-30',
      type: 'Inheritance Dispute'
    }
  ];

  const recentActivity = [
    {
      type: 'case_assigned',
      title: 'New Case Assigned',
      description: 'Boundary dispute case LC-2024-001 assigned',
      date: '2024-01-15 09:30',
      icon: '⚖️',
      priority: 'high'
    },
    {
      type: 'hearing_scheduled',
      title: 'Hearing Scheduled',
      description: 'Hearing scheduled for LC-2024-002 on Feb 1st',
      date: '2024-01-14 16:45',
      icon: '📅',
      priority: 'medium'
    },
    {
      type: 'mediation_completed',
      title: 'Mediation Completed',
      description: 'Mediation session completed for LC-2024-003',
      date: '2024-01-13 14:20',
      icon: '🤝',
      priority: 'normal'
    },
    {
      type: 'document_reviewed',
      title: 'Documents Reviewed',
      description: 'Case documents reviewed for LC-2024-001',
      date: '2024-01-12 11:15',
      icon: '📄',
      priority: 'normal'
    }
  ];

  const caseStats = [
    { label: 'Active Cases', value: 12, icon: '⚖️', color: 'red' },
    { label: 'Resolved This Month', value: 8, icon: '✅', color: 'green' },
    { label: 'Pending Hearings', value: 5, icon: '📅', color: 'orange' },
    { label: 'Mediation Cases', value: 3, icon: '🤝', color: 'purple' }
  ];

  return (
    <div className="profile-page">
      {/* Profile Header */}
      <div className="profile-header" id="profile-info">
        <div className="profile-avatar">
          <div className="avatar-circle legal">
            <span className="avatar-text">{formData.fullname.split(' ').map(n => n[0]).join('')}</span>
          </div>
          <div className="profile-status">
            <span className="status-dot active"></span>
            <span className="status-text">Available</span>
          </div>
        </div>
        
        <div className="profile-info">
          <h1 className="profile-name">{formData.fullname}</h1>
          <p className="profile-email">{formData.email}</p>
          <p className="profile-specialization">Specialization: {formData.specialization}</p>
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
          className={`tab-button ${activeTab === 'cases' ? 'active' : ''}`}
          onClick={() => setActiveTab('cases')}
        >
          <span className="tab-icon">⚖️</span>
          Cases
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
                <h3>Legal Officer Information</h3>
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
                  <label>Bar Number</label>
                  <span>{formData.barNumber}</span>
                </div>
                <div className="info-item">
                  <label>Specialization</label>
                  <span>{formData.specialization}</span>
                </div>
                <div className="info-item">
                  <label>Experience</label>
                  <span>{formData.experience}</span>
                </div>
                <div className="info-item full-width">
                  <label>Address</label>
                  <span>{formData.address}</span>
                </div>
              </div>
            </div>

            {/* Case Statistics */}
            <div className={`content-section ${isVisible.profileInfo ? 'visible' : ''}`}>
              <h3>Case Overview</h3>
              <div className="stats-grid">
                {caseStats.map((stat, index) => (
                  <div key={index} className={`stat-card ${stat.color}`}>
                    <div className="stat-icon">{stat.icon}</div>
                    <div className="stat-content">
                      <h4>{stat.label}</h4>
                      <p className="stat-number">
                        <AnimatedStat target={stat.value} />
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'cases' && (
          <div className="tab-content" id="cases">
            <div className={`content-section ${isVisible.cases ? 'visible' : ''}`}>
              <div className="section-header">
                <h3>Active Cases</h3>
                <button className="btn btn-primary btn-small">
                  Assign New Case
                </button>
              </div>
              
              <div className="cases-grid">
                {legalCases.map((caseItem, index) => (
                  <div key={caseItem.id} className="case-card">
                    <div className="case-header">
                      <div className="case-icon">⚖️</div>
                      <div className="case-status">
                        <span className={`status-badge ${caseItem.status.toLowerCase().replace(' ', '-')}`}>
                          {caseItem.status}
                        </span>
                        <span className={`priority-badge ${caseItem.priority}`}>
                          {caseItem.priority}
                        </span>
                      </div>
                    </div>
                    <div className="case-content">
                      <h4>{caseItem.id}</h4>
                      <p className="case-title">{caseItem.title}</p>
                      <p className="case-parties">{caseItem.parties}</p>
                      <div className="case-details">
                        <span>Type: {caseItem.type}</span>
                        <span>Filed: {new Date(caseItem.dateFiled).toLocaleDateString()}</span>
                        <span>Next Hearing: {new Date(caseItem.nextHearing).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="case-actions">
                      <button className="btn btn-secondary btn-small">View Details</button>
                      <button className="btn btn-primary btn-small">Update Status</button>
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
              <h3>Recent Legal Activity</h3>
              
              <div className="activity-timeline">
                {recentActivity.map((activity, index) => (
                  <div key={index} className={`activity-item ${activity.priority}`}>
                    <div className="activity-icon">
                      <span>{activity.icon}</span>
                    </div>
                    <div className="activity-content">
                      <h4>{activity.title}</h4>
                      <p>{activity.description}</p>
                      <span className="activity-date">{activity.date}</span>
                    </div>
                    <div className="activity-priority">
                      <span className={`priority-badge ${activity.priority}`}>
                        {activity.priority}
                      </span>
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

export default LegalProfile; 