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
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
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

  return (
    <>
      <Navbar />
      <div className="profile">
        <div className="profile-container">
          <h1>Profile</h1>

          <div className="profile-card">
            <h2>User Information</h2>
            <div className="profile-info">
              <div className="info-item">
                <span className="info-label">Name:</span>
                <span className="info-value">{user?.name}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Email:</span>
                <span className="info-value">{user?.email}</span>
              </div>
            </div>
          </div>

          {summary && (
            <>
              <div className="profile-card">
                <h2>Expense Statistics</h2>
                <div className="stats-grid">
                  <div className="stat-item">
                    <span className="stat-label">Total Expenses</span>
                    <span className="stat-value">{summary.totalExpenses}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Total Amount</span>
                    <span className="stat-value">{formatCurrency(summary.totalAmount)}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Average Expense</span>
                    <span className="stat-value">{formatCurrency(summary.averageExpense)}</span>
                  </div>
                </div>
              </div>

              <div className="profile-card">
                <h2>Expenses by Category</h2>
                <div className="category-list">
                  {Object.entries(summary.categoryTotals).length > 0 ? (
                    Object.entries(summary.categoryTotals)
                      .sort((a, b) => b[1] - a[1])
                      .map(([category, amount]) => (
                        <div key={category} className="category-item">
                          <span className="category-name">{category}</span>
                          <span className="category-amount">{formatCurrency(amount)}</span>
                        </div>
                      ))
                  ) : (
                    <p className="no-data">No category data available</p>
                  )}
                </div>
              </div>

              <div className="profile-card">
                <h2>Monthly Spending (Last 6 Months)</h2>
                <div className="monthly-list">
                  {Object.entries(summary.monthlyTotals).length > 0 ? (
                    Object.entries(summary.monthlyTotals)
                      .reverse()
                      .map(([month, amount]) => (
                        <div key={month} className="monthly-item">
                          <span className="monthly-name">{month}</span>
                          <span className="monthly-amount">{formatCurrency(amount)}</span>
                        </div>
                      ))
                  ) : (
                    <p className="no-data">No monthly data available</p>
                  )}
                </div>
              </div>

              {summary.recentExpenses && summary.recentExpenses.length > 0 && (
                <div className="profile-card">
                  <h2>Recent Expenses</h2>
                  <div className="recent-expenses">
                    {summary.recentExpenses.map(expense => (
                      <div key={expense.id} className="recent-item">
                        <div className="recent-info">
                          <span className="recent-description">{expense.description}</span>
                          <span className="recent-category">{expense.category}</span>
                        </div>
                        <div className="recent-amount">{formatCurrency(expense.amount)}</div>
                        <div className="recent-date">{formatDate(expense.date)}</div>
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

