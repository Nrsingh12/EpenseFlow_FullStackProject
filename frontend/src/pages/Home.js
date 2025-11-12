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
        <div className="home-hero">
          <h1>Welcome to ExpenseFlow</h1>
          <p className="home-subtitle">Track your expenses, manage your budget, and take control of your finances</p>
          {user ? (
            <Link to="/dashboard" className="home-button">
              Go to Dashboard
            </Link>
          ) : (
            <div className="home-actions">
              <Link to="/signup" className="home-button primary">
                Get Started
              </Link>
              <Link to="/login" className="home-button secondary">
                Login
              </Link>
            </div>
          )}
        </div>
        <div className="home-features">
          <div className="feature-card">
            <h3>Easy Tracking</h3>
            <p>Add expenses quickly and categorize them for better organization</p>
          </div>
          <div className="feature-card">
            <h3>Smart Analytics</h3>
            <p>View spending patterns and insights with detailed analytics</p>
          </div>
          <div className="feature-card">
            <h3>Search & Filter</h3>
            <p>Find expenses easily with powerful search, sort, and filter options</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;

