import React from 'react';
import { Link } from 'react-router-dom';
import '../GlobalStyles.css';
import './AdminPanel.css';

const AdminPanel = () => {
  return (
    <div className="page-container">
      <div className="content-card">
        <div className="page-header">
          <h2 className="page-title">Administrator Dashboard</h2>
          <p className="page-subtitle">Manage land records, users, and system operations</p>
        </div>
        
        <div className="admin-actions">
          <Link to="register-user" className="admin-card">
            <div className="card-icon">👥</div>
            <h3>Register New User</h3>
            <p>Create accounts for new administrators, legal officers, or citizens</p>
            <span className="card-arrow">→</span>
          </Link>
          
          <Link to="manage-land-records" className="admin-card">
            <div className="card-icon">📋</div>
            <h3>Manage Land Records</h3>
            <p>View, edit, and manage land title registrations from database and blockchain</p>
            <span className="card-arrow">→</span>
          </Link>
          
          <Link to="manage-users" className="admin-card">
            <div className="card-icon">👤</div>
            <h3>Manage Users</h3>
            <p>View, edit, and manage user accounts and roles</p>
            <span className="card-arrow">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;