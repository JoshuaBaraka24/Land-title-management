import React from 'react';
import { Link } from 'react-router-dom';
import './About.css';

const About = () => {
  return (
    <div className="about-page">
      <div className="container">
        {/* Hero Section */}
        <section className="about-hero">
          <div className="hero-content">
            <h1>About Our Land Management System</h1>
            <p className="hero-subtitle">
              Empowering Kenya with secure, transparent, and efficient land management through cutting-edge blockchain technology.
            </p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="about-section">
          <div className="section-header">
            <h2>Our Mission</h2>
            <p>To revolutionize land management in Kenya by providing a secure, transparent, and accessible platform for land title verification and dispute resolution.</p>
          </div>
          
          <div className="grid grid-3">
            <div className="card feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Security First</h3>
              <p>Advanced blockchain technology ensures the highest level of security for all land records and transactions.</p>
            </div>
            
            <div className="card feature-card">
              <div className="feature-icon">👁️</div>
              <h3>Transparency</h3>
              <p>Complete transparency in all land-related processes, making information accessible to authorized users.</p>
            </div>
            
            <div className="card feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Efficiency</h3>
              <p>Streamlined processes reduce time and costs associated with land verification and dispute resolution.</p>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="about-section">
          <div className="section-header">
            <h2>Key Features</h2>
            <p>Discover what makes our land management system the most advanced solution in Kenya.</p>
          </div>
          
          <div className="features-grid">
            <div className="feature-item">
              <div className="feature-number">01</div>
              <div className="feature-content">
                <h3>Blockchain Verification</h3>
                <p>All land titles are verified and stored on a secure blockchain, ensuring immutability and preventing fraud.</p>
              </div>
            </div>
            
            <div className="feature-item">
              <div className="feature-number">02</div>
              <div className="feature-content">
                <h3>Real-time Updates</h3>
                <p>Instant updates and notifications for all land-related activities and status changes.</p>
              </div>
            </div>
            
            <div className="feature-item">
              <div className="feature-number">03</div>
              <div className="feature-content">
                <h3>Dispute Resolution</h3>
                <p>Integrated dispute management system with professional legal oversight for fair resolution.</p>
              </div>
            </div>
            
            <div className="feature-item">
              <div className="feature-number">04</div>
              <div className="feature-content">
                <h3>Role-based Access</h3>
                <p>Secure access control with different permissions for citizens, legal officers, and administrators.</p>
              </div>
            </div>
            
            <div className="feature-item">
              <div className="feature-number">05</div>
              <div className="feature-content">
                <h3>Digital Documentation</h3>
                <p>Complete digital transformation of land records with secure document storage and retrieval.</p>
              </div>
            </div>
            
            <div className="feature-item">
              <div className="feature-number">06</div>
              <div className="feature-content">
                <h3>Mobile Accessibility</h3>
                <p>Access the system from any device, anywhere, ensuring convenience for all users.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Technology Section */}
        <section className="about-section">
          <div className="section-header">
            <h2>Technology Stack</h2>
            <p>Built with modern, secure, and scalable technologies to serve Kenya's land management needs.</p>
          </div>
          
          <div className="tech-grid">
            <div className="tech-card">
              <div className="tech-icon">🔗</div>
              <h4>Blockchain</h4>
              <p>Ethereum-based smart contracts for secure land record management</p>
            </div>
            
            <div className="tech-card">
              <div className="tech-icon">⚛️</div>
              <h4>React</h4>
              <p>Modern frontend framework for responsive and interactive user interfaces</p>
            </div>
            
            <div className="tech-card">
              <div className="tech-icon">🗄️</div>
              <h4>Supabase</h4>
              <p>Secure backend database and authentication system</p>
            </div>
            
            <div className="tech-card">
              <div className="tech-icon">🔐</div>
              <h4>Web3</h4>
              <p>Blockchain integration and wallet connectivity</p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="about-section">
          <div className="cta-card">
            <h2>Ready to Get Started?</h2>
            <p>Join thousands of Kenyans who trust our system for their land management needs.</p>
            <div className="cta-buttons">
              <Link to="/" className="btn btn-primary">
                Access System
              </Link>
              <Link to="/dashboard/verify" className="btn btn-outline">
                Verify Land Title
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About; 