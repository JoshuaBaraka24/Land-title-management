import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { getCurrentUser } from '../auth';
import './Dashboard.css';

const Dashboard = ({ user }) => {
  return (
    <div className="dashboard">
      <header>
        <h1>Land Title Management System</h1>
        <div className="user-info">
          <span>Welcome, {user?.email}</span>
          <span className="user-role">({user?.role})</span>
        </div>
      </header>
      
      <nav>
        <ul>
          <li>
            <Link to="/verify">Land Verification</Link>
          </li>
          
          {user?.role === 'citizen' && (
            <li>
              <Link to="/disputes">Report Dispute</Link>
            </li>
          )}
          
          {user?.role === 'admin' && (
            <li>
              <Link to="/admin">Admin Panel</Link>
            </li>
          )}
          
          {user?.role === 'legal' && (
            <li>
              <Link to="/legal">Dispute Center</Link>
            </li>
          )}
          
          <li>
            <Link to="/profile">My Profile</Link>
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