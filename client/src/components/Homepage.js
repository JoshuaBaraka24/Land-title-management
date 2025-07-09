import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../authContext';
import heroBgImage from '../assets/hero-bg.jpg';
import { useScrollPosition } from '../hooks/useScrollPosition';
import { useScrollReveal } from '../hooks/useScrollReveal';
import AnimatedStat from './AnimatedStat';
import './GlobalStyles.css';
import './Homepage.css';

const Homepage = () => {
  const { currentUser, profile, logout } = useAuth();
  const navigate = useNavigate();
  const scrollY = useScrollPosition();
  const isVisible = useScrollReveal(['services']);

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.reload();
  };

  const scrollToContact = () => {
    const footer = document.querySelector('.homepage-footer');
    if (footer) {
      footer.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="homepage">
      {/* Navbar */}
      <nav className="homepage-navbar">
        <div className="navbar-container">
          <div className="navbar-left">
            <span className="welcome-text">Welcome, {profile?.fullname || "User"}</span>
            {currentUser?.role === 'admin' && (
              <Link to="/dashboard/admin" className="navbar-btn">Admin Dashboard</Link>
            )}
            {currentUser?.role === 'citizen' && (
              <Link to="/dashboard/verify" className="navbar-btn">Land Verification</Link>
            )}
            {currentUser?.role === 'legal' && (
              <Link to="/dashboard/legal" className="navbar-btn">Dispute Management</Link>
            )}
          </div>
          
          <div className="navbar-right">
            <Link to="/about" className="navbar-link">About</Link>
            <button onClick={scrollToContact} className="navbar-link">Contact Us</button>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div 
          className="hero-background"
          style={{
            background: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6)), url(${heroBgImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
            transform: `translateY(${scrollY * 0.5}px)`
          }}
        >
          <div className="hero-overlay"></div>
        </div>
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              <span className="title-line">Secure Land</span>
              <span className="title-line">Management</span>
              <span className="title-accent">System</span>
            </h1>
            <p className="hero-subtitle">
              Empowering Kenya with blockchain-powered land registration. 
              <br />
              <span className="subtitle-highlight">Transparent • Secure • Trusted</span>
            </p>
          </div>
        </div>
        <div className="hero-scroll-indicator">
          <div className="scroll-arrow"></div>
          <span className="scroll-text">Scroll to explore</span>
        </div>
      </section>

      {/* Services Section */}
      <section className="services-section" id="services">
        <div className="container">
          <div className={`section-header ${isVisible.services ? 'visible' : ''}`}>
            <h2 className="section-title">Services</h2>
            <p className="section-subtitle">
              Comprehensive land management solutions for all your needs
            </p>
          </div>
          
          <div className="services-grid">
            {/* Land Verification - Available to all users */}
            <Link to="/dashboard/verify" className={`service-card service-card-link ${isVisible.services ? 'visible' : ''}`}>
              <div className="service-icon">🔍</div>
              <h3>Land Verification</h3>
              <p>Verify land title authenticity and ownership details instantly</p>
              <div className="service-link">Get Started →</div>
            </Link>
            
            {/* Citizen-specific services */}
            {currentUser?.role === 'citizen' && (
              <Link to="/dashboard/disputes" className={`service-card service-card-link ${isVisible.services ? 'visible' : ''}`}>
                <div className="service-icon">⚖️</div>
                <h3>Report Disputes</h3>
                <p>Report disputes to be resolved by legal officers</p>
                <div className="service-link">Report Issue →</div>
              </Link>
            )}
            
            {/* Admin-specific services */}
            {currentUser?.role === 'admin' && (
              <>
                <Link to="/dashboard/admin/manage-land-records" className={`service-card service-card-link ${isVisible.services ? 'visible' : ''}`}>
                  <div className="service-icon">📋</div>
                  <h3>Title Registration</h3>
                  <p>Register new land titles with secure digital documentation</p>
                  <div className="service-link">Register Now →</div>
                </Link>
                
                <Link to="/dashboard/admin/register-user" className={`service-card service-card-link ${isVisible.services ? 'visible' : ''}`}>
                  <div className="service-icon">👤</div>
                  <h3>Register Users</h3>
                  <p>Register new users into the system</p>
                  <div className="service-link">Register User →</div>
                </Link>
              </>
            )}
            
            {/* Legal officer-specific services */}
            {currentUser?.role === 'legal' && (
              <Link to="/dashboard/legal" className={`service-card service-card-link ${isVisible.services ? 'visible' : ''}`}>
                <div className="service-icon">⚖️</div>
                <h3>Dispute Resolution</h3>
                <p>Report and resolve land disputes through our legal framework</p>
                <div className="service-link">Manage Disputes →</div>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="homepage-footer" id="contact">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h4>Secure Land Management System</h4>
              <p>Empowering Kenya with secure and transparent land management</p>
            </div>
            
            <div className="footer-section">
              <h4>Quick Links</h4>
              <ul>
                {currentUser?.role === 'citizen' && (
                  <>
                    <li><Link to="/dashboard/verify">Land Verification</Link></li>
                    <li><Link to="/dashboard/disputes">Report Dispute</Link></li>
                  </>
                )}
                {currentUser?.role === 'admin' && (
                  <>
                    <li><Link to="/dashboard/verify">Land Verification</Link></li>
                    <li><Link to="/dashboard/admin/manage-land-records">Manage Land Records</Link></li>
                    <li><Link to="/dashboard/admin/manage-users">Manage Users</Link></li>
                  </>
                )}
                {currentUser?.role === 'legal' && (
                  <>
                    <li><Link to="/dashboard/verify">Land Verification</Link></li>
                    <li><Link to="/dashboard/legal">Dispute Management</Link></li>
                  </>
                )}
              </ul>
            </div>
            
            <div className="footer-section">
              <h4>Contact Info</h4>
              <p>Email: info@landtitle.ke</p>
              <p>Phone: +254 700 000 000</p>
              <p>Address: Nairobi, Kenya</p>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} Secure Land Management System. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Homepage; 