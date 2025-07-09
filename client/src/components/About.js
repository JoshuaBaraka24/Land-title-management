import React from 'react';
import { Link } from 'react-router-dom';
import { useScrollReveal } from '../hooks/useScrollReveal';
import './About.css';
import AnimatedStat from './AnimatedStat';
import './GlobalStyles.css';

const About = () => {
  const isVisible = useScrollReveal(['features', 'tech', 'contact']);
  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="container">
          <div className="about-hero-content">
            <h1 className="about-title">About Our Land Management System</h1>
            <p className="about-subtitle">
              Revolutionizing land title management in Kenya through blockchain technology and digital innovation
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="mission-section">
        <div className="container">
          <div className="mission-content">
            <h2>Our Mission</h2>
            <p>
              To provide a secure, transparent, and efficient land title management system that empowers 
              Kenyans with reliable access to their land records while ensuring the integrity and authenticity 
              of all land transactions through cutting-edge blockchain technology.
            </p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="features-section" id="features">
        <div className="container">
          <div className={`section-header ${isVisible.features ? 'visible' : ''}`}>
            <h2>Key Features</h2>
          </div>
          <div className="features-grid">
            <div className={`feature-item ${isVisible.features ? 'visible' : ''}`}>
              <div className="feature-icon">🔒</div>
              <h3>Blockchain Security</h3>
              <p>All land records are secured using advanced blockchain technology, ensuring tamper-proof and immutable records.</p>
            </div>
            
            <div className={`feature-item ${isVisible.features ? 'visible' : ''}`}>
              <div className="feature-icon">⚡</div>
              <h3>Instant Verification</h3>
              <p>Verify land title authenticity and ownership details in real-time with our advanced verification system.</p>
            </div>
            
            <div className={`feature-item ${isVisible.features ? 'visible' : ''}`}>
              <div className="feature-icon">📱</div>
              <h3>Digital Access</h3>
              <p>Access your land records anytime, anywhere through our modern web platform and mobile applications.</p>
            </div>
            
            <div className={`feature-item ${isVisible.features ? 'visible' : ''}`}>
              <div className="feature-icon">🏛️</div>
              <h3>Government Compliance</h3>
              <p>Fully compliant with Kenyan land laws and regulations, ensuring legal validity of all transactions.</p>
            </div>
            
            <div className={`feature-item ${isVisible.features ? 'visible' : ''}`}>
              <div className="feature-icon">🔄</div>
              <h3>Transparent Process</h3>
              <p>Complete transparency in all land transactions with detailed audit trails and public verification.</p>
            </div>
            
            <div className={`feature-item ${isVisible.features ? 'visible' : ''}`}>
              <div className="feature-icon">🛡️</div>
              <h3>Dispute Resolution</h3>
              <p>Integrated dispute resolution system to handle land conflicts efficiently and fairly.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="technology-section">
        <div className="container">
          <div className="tech-content">
            <h2>Technology Behind Our System</h2>
            <div className="tech-grid">
              <div className="tech-item">
                <h3>Blockchain Technology</h3>
                <p>We use Ethereum-based smart contracts to ensure the security and immutability of all land records. Each transaction is cryptographically signed and stored on the blockchain.</p>
              </div>
              
              <div className="tech-item">
                <h3>Digital Identity Verification</h3>
                <p>Advanced identity verification systems ensure that only authorized users can access and modify land records, preventing fraud and unauthorized access.</p>
              </div>
              
              <div className="tech-item">
                <h3>Real-time Synchronization</h3>
                <p>All changes to land records are synchronized in real-time across the network, ensuring consistency and up-to-date information for all users.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact-section">
        <div className="container">
          <div className="contact-content">
            <h2>Get in Touch</h2>
            <p>Have questions about our system? Our team is here to help you.</p>
            <div className="contact-info">
              <div className="contact-item">
                <strong>Email:</strong> info@landtitle.ke
              </div>
              <div className="contact-item">
                <strong>Phone:</strong> +254 700 000 000
              </div>
              <div className="contact-item">
                <strong>Address:</strong> Nairobi, Kenya
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About; 