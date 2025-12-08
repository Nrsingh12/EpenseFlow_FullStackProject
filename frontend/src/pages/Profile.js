import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import './Profile.css';

const Profile = () => {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSummary();
  }, []);

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

  return (
    <>
      <Navbar />
      <div className="profile">
        <div className="profile-container">
          <h1>Profile</h1>

          <div className="profile-header">
            <div className="user-avatar">
              {user?.name ? getInitials(user.name) : 'U'}
            </div>
            <div className="user-info">
              <h2>{user?.name}</h2>
              <p>{user?.email}</p>
            </div>
          </div>

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

