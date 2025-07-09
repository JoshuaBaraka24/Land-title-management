import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../authContext';
import './Dashboard.css';
import './GlobalStyles.css';

const Dashboard = ({ user }) => {
  const { logout, currentUser, profile } = useAuth();

  console.log("Profile in Dashboard:", profile);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <div className="page-container">
      <div className="content-card dashboard-card">
        <header className="dashboard-header">
          <div className="header-content">
            <h1 className="page-title">Land Title Management System</h1>
            <div className="user-info">
              <span className="welcome-text">Welcome, {profile?.fullname || "User"}</span>
              <button onClick={handleLogout} className="btn btn-secondary btn-small logout-btn">
                Logout
              </button>
            </div>
          </div>
        </header>
        
        <nav className="dashboard-nav">
          <ul className="nav-list">
            <li className="nav-item">
              <Link to="verify" className="nav-link">
                <span className="nav-icon">🔍</span>
                Land Verification
              </Link>
            </li>
            
            {user?.role === 'citizen' && (
              <li className="nav-item">
                <Link to="disputes" className="nav-link">
                  <span className="nav-icon">⚖️</span>
                  Report Dispute
                </Link>
              </li>
            )}
            
            {user?.role === 'admin' && (
              <li className="nav-item">
                <Link to="admin" className="nav-link">
                  <span className="nav-icon">⚙️</span>
                  Admin Panel
                </Link>
              </li>
            )}
            
            {user?.role === 'legal' && (
              <li className="nav-item">
                <Link to="legal" className="nav-link">
                  <span className="nav-icon">🏛️</span>
                  Dispute Center
                </Link>
              </li>
            )}
            
            <li className="nav-item">
              <Link to="profile" className="nav-link">
                <span className="nav-icon">👤</span>
                My Profile
              </Link>
            </li>
          </ul>
        </nav>
        
        <main className="dashboard-main">
          <Outlet />
        </main>
        
        <footer className="dashboard-footer">
          <p>© {new Date().getFullYear()} Land Title Management System</p>
        </footer>
      </div>
    </div>
  );
};

export default Dashboard;