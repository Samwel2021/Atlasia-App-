import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/LandingPage.css';

const LandingPage = () => {
  return (
    <div className="landing-page">
      {/* Header/Navbar */}
      <nav className="navbar">
        <div className="container">
          <h1 className="logo">Atlasia Group Ltd</h1>
          <div className="nav-links">
            <a href="#features">Features</a>
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <h2>Your Trusted Logistics Partner</h2>
          <p>Real-time cargo tracking, multi-portal management, and seamless communication all in one platform.</p>
          <div className="hero-buttons">
            <Link to="/login" className="btn btn-primary">Get Started</Link>
            <button className="btn btn-secondary">Learn More</button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features" id="features">
        <div className="container">
          <h2>Why Choose Atlasia?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📍</div>
              <h3>Live Cargo Tracking</h3>
              <p>Track your shipments in real-time with GPS integration and location updates.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔐</div>
              <h3>Secure Authentication</h3>
              <p>Email verification with OTP and admin approval for secure access.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💬</div>
              <h3>Real-time Chat</h3>
              <p>Communicate instantly with admin from customer or transporter portals.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3>Multi-Platform</h3>
              <p>Use on web browser or install as mobile app - fully responsive design.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">👥</div>
              <h3>Three Role Types</h3>
              <p>Admin, Customer, and Transporter portals with specialized dashboards.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Analytics Dashboard</h3>
              <p>Comprehensive reports and statistics for admins to manage operations.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <div className="container">
          <h2>How It Works</h2>
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Sign Up</h3>
              <p>Enter your email and choose your role</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>Verify Email</h3>
              <p>Receive and enter OTP for verification</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>Admin Approval</h3>
              <p>Await admin approval and portal allocation</p>
            </div>
            <div className="step">
              <div className="step-number">4</div>
              <h3>Start Using</h3>
              <p>Access your portal and start managing shipments</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p>&copy; 2024 Atlasia Logistics. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
