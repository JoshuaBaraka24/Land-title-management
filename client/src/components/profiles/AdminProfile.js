import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../authContext';
import '../../components/GlobalStyles.css';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import AnimatedStat from '../AnimatedStat';
import './ProfilePages.css';
import LandRecordList from '../LandRecordList';

const AdminProfile = () => {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const isVisible = useScrollReveal(['profile-info', 'system-stats', 'recent-activity']);

  const [formData, setFormData] = useState({
    fullname: profile?.fullname || 'Admin User',
    email: profile?.email || 'admin@landtitle.ke',
    phone: profile?.phone || '+254 700 000 000',
    idNumber: profile?.idNumber || 'ADMIN001',
    address: profile?.address || 'Nairobi, Kenya',
    department: profile?.department || 'System Administration',
    employeeId: profile?.employeeId || 'EMP001',
    accessLevel: profile?.accessLevel || 'Super Admin'
  });

  const systemStats = [
    { label: 'Total Users', value: 1247, icon: '👥', color: 'red' },
    { label: 'Land Titles', value: 50432, icon: '📋', color: 'green' },
    { label: 'Active Disputes', value: 23, icon: '⚖️', color: 'orange' },
    { label: 'Verified Today', value: 156, icon: '✅', color: 'purple' },
    { label: 'Pending Approvals', value: 89, icon: '⏳', color: 'red' },
    { label: 'System Uptime', value: 99.9, icon: '🖥️', color: 'teal', suffix: '%' }
  ];

  const recentActivity = [
    {
      type: 'user_registration',
      title: 'New User Registered',
      description: 'John Doe registered as a citizen',
      date: '2024-01-15 14:30',
      icon: '👤',
      priority: 'normal'
    },
    {
      type: 'title_verification',
      title: 'Title Verification Completed',
      description: 'LT-2024-001 verified successfully',
      date: '2024-01-15 13:45',
      icon: '✅',
      priority: 'high'
    },
    {
      type: 'dispute_reported',
      title: 'New Dispute Reported',
      description: 'Boundary dispute reported for LT-2024-003',
      date: '2024-01-15 12:20',
      icon: '⚠️',
      priority: 'high'
    },
    {
      type: 'system_maintenance',
      title: 'System Maintenance',
      description: 'Scheduled maintenance completed',
      date: '2024-01-15 10:00',
      icon: '🔧',
      priority: 'normal'
    }
  ];

  const quickActions = [
    { title: 'Register New User', icon: '👤', action: 'register-user' },
    { title: 'Verify Land Title', icon: '✅', action: 'verify-title' },
    { title: 'View Disputes', icon: '⚖️', action: 'view-disputes' },
    { title: 'System Reports', icon: '📊', action: 'reports' },
    { title: 'Backup System', icon: '💾', action: 'backup' },
    { title: 'User Management', icon: '⚙️', action: 'manage-users' }
  ];

  return (
    <div className="profile-page">
      {/* Profile Header */}
      <div className="profile-header" id="profile-info">
        <div className="profile-avatar">
          <div className="avatar-circle admin">
            <span className="avatar-text">{formData.fullname.split(' ').map(n => n[0]).join('')}</span>
          </div>
          <div className="profile-status">
            <span className="status-dot active"></span>
            <span className="status-text">Online</span>
          </div>
        </div>
        
        <div className="profile-info">
          <h1 className="profile-name">{formData.fullname}</h1>
          <p className="profile-email">{formData.email}</p>
          <p className="profile-access">Access Level: {formData.accessLevel}</p>
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
          className={`tab-button ${activeTab === 'system-stats' ? 'active' : ''}`}
          onClick={() => setActiveTab('system-stats')}
        >
          <span className="tab-icon">🖥️</span>
          System Stats
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
                <h3>Administrator Information</h3>
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
                  <label>Employee ID</label>
                  <span>{formData.employeeId}</span>
                </div>
                <div className="info-item">
                  <label>Department</label>
                  <span>{formData.department}</span>
                </div>
                <div className="info-item">
                  <label>Access Level</label>
                  <span className="access-badge">{formData.accessLevel}</span>
                </div>
                <div className="info-item full-width">
                  <label>Address</label>
                  <span>{formData.address}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className={`content-section ${isVisible.profileInfo ? 'visible' : ''}`}>
              <h3>Quick Actions</h3>
              <div className="actions-grid">
                {quickActions.map((action, index) => (
                  <button key={index} className="action-card">
                    <div className="action-icon">{action.icon}</div>
                    <span className="action-title">{action.title}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'system-stats' && (
          <div className="tab-content" id="system-stats">
            <div className={`content-section ${isVisible.systemStats ? 'visible' : ''}`}>
              <div className="section-header">
                <h3>System Statistics</h3>
                <button className="btn btn-primary btn-small">
                  Generate Report
                </button>
              </div>
              
              <div className="stats-grid">
                {systemStats.map((stat, index) => (
                  <div key={index} className={`stat-card ${stat.color}`}>
                    <div className="stat-icon">{stat.icon}</div>
                    <div className="stat-content">
                      <h4>{stat.label}</h4>
                      <p className="stat-number">
                        <AnimatedStat 
                          target={stat.value} 
                          decimals={stat.suffix === '%' ? 1 : 0}
                          suffix={stat.suffix || ''}
                        />
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="tab-content" id="activity">
            <div className={`content-section ${isVisible.recentActivity ? 'visible' : ''}`}>
              <h3>Recent System Activity</h3>
              
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

export default AdminProfile; 