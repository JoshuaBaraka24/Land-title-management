import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../authContext';  // Add this import
import './Dashboard.css';

const Dashboard = ({ user }) => {
  const { logout, currentUser, profile } = useAuth();  // Get logout function and profile from context

  console.log("Profile in Dashboard:", profile);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <div className="dashboard">
      <header>
        <h1>Land Title Management System</h1>
        <div className="user-info">
          <span>Welcome, {profile?.fullname || "User"}</span>
          <span className="user-role">({profile?.role})</span>
          {/* Add logout button */}
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </header>
      
      <nav>
        <ul>
          <li>
            <Link to="verify">Land Verification</Link>
          </li>
          
          {user?.role === 'citizen' && (
            <li>
              <Link to="disputes">Report Dispute</Link>
            </li>
          )}
          
          {user?.role === 'admin' && (
            <li>
              <Link to="admin">Admin Panel</Link>
            </li>
          )}
          
          {user?.role === 'legal' && (
            <li>
              <Link to="legal">Dispute Center</Link>
            </li>
          )}
          
          <li>
            <Link to="profile">My Profile</Link>
          </li>
        </ul>
      </nav>
      
      <main>
        <Outlet /> {/* This renders nested routes */}
      </main>
      
      <footer>
        <p>© {new Date().getFullYear()} Land Title Management System</p>
      </footer>
    </div>
  );
};

export default Dashboard;