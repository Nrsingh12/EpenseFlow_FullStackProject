import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import './Profile.css';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: ''
  });

  useEffect(() => {
    fetchSummary();
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        currentPassword: '',
        newPassword: ''
      });
    }
  }, [user]);

  const fetchSummary = async () => {
    try {
      const data = await api.get('/api/analytics/summary');
      setSummary(data);
    } catch (err) {
      console.error('Failed to fetch summary:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="profile">
          <div className="loading">Loading...</div>
        </div>
      </>
    );
  }

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getMaxAmount = () => {
    if (!summary || !summary.monthlyTotals) return 0;
    return Math.max(...Object.values(summary.monthlyTotals));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const updateData = {
        name: formData.name,
        email: formData.email
      };

      if (formData.newPassword) {
        if (!formData.currentPassword) {
          setError('Current password is required to change password');
          return;
        }
        updateData.currentPassword = formData.currentPassword;
        updateData.newPassword = formData.newPassword;
      }

      await api.put('/api/auth/profile', updateData);
      setSuccess('Profile updated successfully');
      setIsEditing(false);
      setFormData({ ...formData, currentPassword: '', newPassword: '' });
      window.location.reload();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update profile');
    }
  };

  const handleDeleteAccount = async () => {
    const password = prompt('Enter your password to confirm account deletion:');
    
    if (!password) return;

    if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }

    try {
      await api.delete('/api/auth/profile', { password });
      await logout();
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete account');
    }
  };

  return (
    <>
      <Navbar />
      <div className="profile">
        <div className="profile-container">
          <h1>Profile</h1>

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <div className="profile-header">
            <div className="user-avatar">
              {user?.name ? getInitials(user.name) : 'U'}
            </div>
            <div className="user-info">
              <h2>{user?.name}</h2>
              <p>{user?.email}</p>
            </div>
            <div className="profile-actions">
              <button onClick={() => setIsEditing(!isEditing)} className="edit-btn">
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
              <button onClick={handleDeleteAccount} className="delete-btn">
                Delete Account
              </button>
            </div>
          </div>

          {isEditing && (
            <div className="profile-card">
              <h2>Edit Profile</h2>
              <form onSubmit={handleUpdateProfile}>
                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="currentPassword">Current Password (required to change password)</label>
                  <input
                    type="password"
                    id="currentPassword"
                    value={formData.currentPassword}
                    onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                    placeholder="Leave blank to keep current password"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="newPassword">New Password</label>
                  <input
                    type="password"
                    id="newPassword"
                    value={formData.newPassword}
                    onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                    placeholder="Leave blank to keep current password"
                    minLength="6"
                  />
                </div>
                <button type="submit" className="save-btn">Save Changes</button>
              </form>
            </div>
          )}

          {summary && (
            <>
              <div className="stats-overview">
                <div className="stat-card">
                  <h3>Total Expenses</h3>
                  <div className="stat-value">{summary.totalExpenses}</div>
                </div>
                <div className="stat-card">
                  <h3>Total Spent</h3>
                  <div className="stat-value">{formatCurrency(summary.totalAmount)}</div>
                </div>
                <div className="stat-card">
                  <h3>Average Expense</h3>
                  <div className="stat-value">{formatCurrency(summary.averageExpense)}</div>
                </div>
              </div>

              <div className="profile-grid">
                <div className="profile-card">
                  <h2>Top Categories</h2>
                  <div className="category-list">
                    {Object.entries(summary.categoryTotals).length > 0 ? (
                      Object.entries(summary.categoryTotals)
                        .sort((a, b) => b[1] - a[1])
                        .slice(0, 5)
                        .map(([category, amount], index) => (
                          <div key={category} className="category-item">
                            <div className="category-info">
                              <div className="category-rank">{index + 1}</div>
                              <span className="category-name">{category}</span>
                            </div>
                            <span className="category-amount">{formatCurrency(amount)}</span>
                          </div>
                        ))
                    ) : (
                      <p className="no-data">No category data available</p>
                    )}
                  </div>
                </div>

                <div className="profile-card">
                  <h2>Monthly Spending</h2>
                  <div className="monthly-trend">
                    {Object.entries(summary.monthlyTotals).length > 0 ? (
                      Object.entries(summary.monthlyTotals)
                        .reverse()
                        .slice(0, 6)
                        .map(([month, amount]) => (
                          <div key={month} className="trend-bar">
                            <div className="trend-header">
                              <span className="trend-month">{month}</span>
                              <span className="trend-amount">{formatCurrency(amount)}</span>
                            </div>
                            <div className="trend-progress">
                              <div 
                                className="trend-fill" 
                                style={{ width: `${(amount / getMaxAmount()) * 100}%` }}
                              />
                            </div>
                          </div>
                        ))
                    ) : (
                      <p className="no-data">No monthly data available</p>
                    )}
                  </div>
                </div>
              </div>

              {summary.recentExpenses && summary.recentExpenses.length > 0 && (
                <div className="profile-card full-width">
                  <h2>Recent Activity</h2>
                  <div className="recent-expenses">
                    {summary.recentExpenses.slice(0, 5).map(expense => (
                      <div key={expense.id} className="recent-item">
                        <div className="recent-icon">💳</div>
                        <div className="recent-info">
                          <span className="recent-description">{expense.description}</span>
                          <span className="recent-category">{expense.category}</span>
                        </div>
                        <div className="recent-right">
                          <div className="recent-amount">{formatCurrency(expense.amount)}</div>
                          <div className="recent-date">{formatDate(expense.date)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Profile;

