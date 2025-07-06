import React from 'react';
import { Link } from 'react-router-dom';
import heroBgImage from '../assets/hero-bg.jpg';
import { useScrollPosition } from '../hooks/useScrollPosition';
import { useScrollReveal } from '../hooks/useScrollReveal';
import AnimatedStat from './AnimatedStat';
import './GlobalStyles.css';
import './Homepage.css';

const Homepage = () => {
  const scrollY = useScrollPosition();
  const isVisible = useScrollReveal(['services', 'stats', 'cta']);

  return (
    <div className="homepage">
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
            <div className="hero-badge">
              <span className="badge-icon">🏛️</span>
              <span className="badge-text">Official Government System</span>
            </div>
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
            <div className="hero-buttons">
              <Link to="/login" className="btn btn-primary btn-large hero-btn-primary">
                <span className="btn-icon">🔐</span>
                Access System
              </Link>
              <Link to="/about" className="btn btn-secondary btn-large hero-btn-secondary">
                <span className="btn-icon">📋</span>
                Learn More
              </Link>
            </div>
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
            <h2 className="section-title">Our Services</h2>
            <p className="section-subtitle">
              Comprehensive land management solutions for all your needs
            </p>
          </div>
          
          <div className="services-grid">
            <Link to="/login" className={`service-card service-card-link ${isVisible.services ? 'visible' : ''}`}>
              <div className="service-icon">🔍</div>
              <h3>Land Verification</h3>
              <p>Verify land title authenticity and ownership details instantly</p>
              <div className="service-link">Get Started →</div>
            </Link>
            
            <Link to="/login" className={`service-card service-card-link ${isVisible.services ? 'visible' : ''}`}>
              <div className="service-icon">📋</div>
              <h3>Title Registration</h3>
              <p>Register new land titles with secure digital documentation</p>
              <div className="service-link">Register Now →</div>
            </Link>
            
            <Link to="/login" className={`service-card service-card-link ${isVisible.services ? 'visible' : ''}`}>
              <div className="service-icon">⚖️</div>
              <h3>Dispute Resolution</h3>
              <p>Report and resolve land disputes through our legal framework</p>
              <div className="service-link">Report Issue →</div>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section" id="stats">
        <div className="container">
          <div className="stats-grid">
            <div className={`stat-item ${isVisible.stats ? 'visible' : ''}`}>
              <div className="stat-number">
                <AnimatedStat target={50000} suffix="+" />
              </div>
              <div className="stat-label">Land Titles Registered</div>
            </div>
            
            <div className={`stat-item ${isVisible.stats ? 'visible' : ''}`}>
              <div className="stat-number">
                <AnimatedStat target={99.9} decimals={1} suffix="%" />
              </div>
              <div className="stat-label">System Uptime</div>
            </div>
            
            <div className={`stat-item ${isVisible.stats ? 'visible' : ''}`}>
              <div className="stat-number">
                <AnimatedStat target={24} suffix="/7" />
              </div>
              <div className="stat-label">Support Available</div>
            </div>
            
            <div className={`stat-item ${isVisible.stats ? 'visible' : ''}`}>
              <div className="stat-number">
                <AnimatedStat target={100} suffix="%" />
              </div>
              <div className="stat-label">Secure & Verified</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section" id="cta">
        <div className="container">
          <div className={`cta-content ${isVisible.cta ? 'visible' : ''}`}>
            <h2>Ready to Get Started?</h2>
            <p>Join thousands of Kenyans who trust our system for their land management needs</p>
            <Link to="/login" className="btn btn-primary btn-large">
              Sign In Now
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="homepage-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h4>Secure Land Management System</h4>
              <p>Empowering Kenya with secure and transparent land management</p>
            </div>
            
            <div className="footer-section">
              <h4>Quick Links</h4>
              <ul>
                <li><Link to="/login">Sign In</Link></li>
                <li><Link to="/about">About Us</Link></li>
                <li><Link to="/contact">Contact</Link></li>
                <li><Link to="/help">Help & Support</Link></li>
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