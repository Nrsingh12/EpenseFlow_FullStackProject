import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import './Home.css';

const Home = () => {
  const { user } = useAuth();

  return (
    <>
      <Navbar />
      <div className="home">
        <section className="hero-section">
          <div className="hero-container">
            <div className="hero-content">
              <h1 className="hero-title">Take Control of Your Finances</h1>
              <p className="hero-subtitle">
                Track expenses, analyze spending patterns, and achieve your financial goals with ExpenseFlow
              </p>
              {user ? (
                <Link to="/dashboard" className="cta-button">
                  Go to Dashboard →
                </Link>
              ) : (
                <div className="hero-buttons">
                  <Link to="/signup" className="cta-button primary">
                    Get Started Free
                  </Link>
                  <Link to="/login" className="cta-button secondary">
                    Sign In
                  </Link>
                </div>
              )}
            </div>
            <div className="hero-stats">
              <div className="stat-box">
                <div className="stat-icon">📊</div>
                <div className="stat-number">10K+</div>
                <div className="stat-label">Active Users</div>
              </div>
              <div className="stat-box">
                <div className="stat-icon">💰</div>
                <div className="stat-number">₹50Cr+</div>
                <div className="stat-label">Tracked</div>
              </div>
              <div className="stat-box">
                <div className="stat-icon">⭐</div>
                <div className="stat-number">4.9/5</div>
                <div className="stat-label">Rating</div>
              </div>
            </div>
          </div>
        </section>

        <section className="features-section">
          <div className="section-container">
            <div className="section-header">
              <h2>Why Choose ExpenseFlow?</h2>
              <p>Everything you need to manage your money better</p>
            </div>
            <div className="features-grid">
              <div className="feature-box">
                <div className="feature-icon-wrapper">
                  <span className="feature-icon">📱</span>
                </div>
                <h3>Easy to Use</h3>
                <p>Simple and intuitive interface that makes expense tracking effortless</p>
              </div>
              <div className="feature-box">
                <div className="feature-icon-wrapper">
                  <span className="feature-icon">📈</span>
                </div>
                <h3>Smart Analytics</h3>
                <p>Get insights into your spending habits with detailed charts and reports</p>
              </div>
              <div className="feature-box">
                <div className="feature-icon-wrapper">
                  <span className="feature-icon">🔒</span>
                </div>
                <h3>Secure & Private</h3>
                <p>Your financial data is encrypted and protected with industry-standard security</p>
              </div>
              <div className="feature-box">
                <div className="feature-icon-wrapper">
                  <span className="feature-icon">🎯</span>
                </div>
                <h3>Goal Tracking</h3>
                <p>Set budgets and track your progress towards financial goals</p>
              </div>
              <div className="feature-box">
                <div className="feature-icon-wrapper">
                  <span className="feature-icon">🔍</span>
                </div>
                <h3>Advanced Filters</h3>
                <p>Find any expense quickly with powerful search and filter options</p>
              </div>
              <div className="feature-box">
                <div className="feature-icon-wrapper">
                  <span className="feature-icon">📊</span>
                </div>
                <h3>Category Management</h3>
                <p>Organize expenses by categories for better financial overview</p>
              </div>
            </div>
          </div>
        </section>

        <section className="cta-section">
          <div className="cta-container">
            <h2>Ready to Start Your Financial Journey?</h2>
            <p>Join thousands of users who are already managing their money smarter</p>
            {!user && (
              <Link to="/signup" className="cta-button large">
                Start Free Today →
              </Link>
            )}
          </div>
        </section>
      </div>
    </>
  );
};

export default Home;
