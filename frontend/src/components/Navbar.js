import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          ExpenseFlow
        </Link>
        {user ? (
          <div className="navbar-menu">
            <Link to="/dashboard" className="navbar-link">
              Dashboard
            </Link>
            <Link to="/profile" className="navbar-link">
              Profile
            </Link>
            <span className="navbar-user">Hello, {user.name}</span>
            <button onClick={handleLogout} className="navbar-button">
              Logout
            </button>
          </div>
        ) : (
          <div className="navbar-menu">
            <Link to="/login" className="navbar-link">
              Login
            </Link>
            <Link to="/signup" className="navbar-button">
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

