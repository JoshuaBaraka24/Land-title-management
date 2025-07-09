import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../authContext';
import './Dashboard.css';

const Dashboard = ({ user }) => {
  const { logout } = useAuth();
  const location = useLocation();

  const handleLogout = () => {
    logout();
  };

  const getNavItems = () => {
    const items = [
      {
        path: '/dashboard/verify',
        label: 'Land Verification',
        icon: '🔍',
        available: true
      }
    ];

    if (user?.role === 'citizen') {
      items.push({
        path: '/dashboard/disputes',
        label: 'Report Disputes',
        icon: '⚖️',
        available: true
      });
    }

    if (user?.role === 'admin') {
      items.push(
        {
          path: '/dashboard/admin',
          label: 'Admin Panel',
          icon: '⚙️',
          available: true
        },
        {
          path: '/dashboard/admin/manage-land-records',
          label: 'Manage Land Records',
          icon: '📋',
          available: true
        },
        {
          path: '/dashboard/admin/register-user',
          label: 'Register Users',
          icon: '👤',
          available: true
        },
        {
          path: '/dashboard/admin/manage-users',
          label: 'Manage Users',
          icon: '👥',
          available: true
        }
      );
    }

    if (user?.role === 'legal') {
      items.push({
        path: '/dashboard/legal',
        label: 'Dispute Management',
        icon: '⚖️',
        available: true
      });
    }

    items.push({
      path: '/dashboard/profile',
      label: 'Profile',
      icon: '👤',
      available: true
    });

    return items;
  };

  const navItems = getNavItems();

  return (
    <div className="dashboard">
      <div className="dashboard-container">
        {/* Sidebar */}
        <aside className="dashboard-sidebar">
          <div className="sidebar-header">
            <h2>Dashboard</h2>
            <p>Welcome, {user?.fullname || 'User'}</p>
          </div>

          <nav className="sidebar-nav">
            <ul className="nav-list">
              {navItems.map((item) => (
                <li key={item.path} className="nav-item">
                  <Link
                    to={item.path}
                    className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                  >
                    <span className="nav-icon">{item.icon}</span>
                    <span className="nav-label">{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="sidebar-footer">
            <button onClick={handleLogout} className="btn btn-outline logout-btn">
              <span className="nav-icon">🚪</span>
              Logout
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="dashboard-main">
          <div className="main-content">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;