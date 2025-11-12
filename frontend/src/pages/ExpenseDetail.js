import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../utils/api';
import './ExpenseDetail.css';

const ExpenseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [expense, setExpense] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  // Helper function to get current date in YYYY-MM-DD format
  const getCurrentDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: '',
    date: getCurrentDate()
  });

  const fetchExpense = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.get(`/api/expenses/${id}`);
      setExpense(data);
      setFormData({
        description: data.description,
        amount: data.amount.toString(),
        category: data.category,
        date: new Date(data.date).toISOString().split('T')[0]
      });
    } catch (err) {
      setError('Failed to fetch expense');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id === 'add') {
      setIsEditing(true);
      setFormData({
        description: '',
        amount: '',
        category: '',
        date: getCurrentDate()
      });
      setLoading(false);
    } else {
      fetchExpense();
    }
  }, [id, fetchExpense]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (id === 'add') {
        await api.post('/api/expenses', formData);
        navigate('/dashboard');
      } else {
        await api.put(`/api/expenses/${id}`, formData);
        setIsEditing(false);
        fetchExpense();
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save expense');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await api.delete(`/api/expenses/${id}`);
        navigate('/dashboard');
      } catch (err) {
        setError('Failed to delete expense');
      }
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
        <div className="expense-detail">
          <div className="loading">Loading...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="expense-detail">
        <div className="expense-detail-container">
          <Link to="/dashboard" className="back-link">← Back to Dashboard</Link>

          {error && <div className="error-message">{error}</div>}

          {isEditing ? (
            <div className="expense-form-card">
              <h2>{id === 'add' ? 'Add New Expense' : 'Edit Expense'}</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="description">Description</label>
                  <input
                    type="text"
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                    placeholder="Enter expense description"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="amount">Amount</label>
                  <input
                    type="number"
                    id="amount"
                    step="0.01"
                    min="0"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    required
                    placeholder="Enter amount"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="category">Category</label>
                  <input
                    type="text"
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                    placeholder="Enter category (e.g., Food, Transport, etc.)"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="date">Date</label>
                  <input
                    type="date"
                    id="date"
                    value={formData.date || getCurrentDate()}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                  />
                </div>
                <div className="form-actions">
                  <button type="submit" className="save-btn">
                    {id === 'add' ? 'Add Expense' : 'Save Changes'}
                  </button>
                  {id !== 'add' && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false);
                        fetchExpense();
                      }}
                      className="cancel-btn"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          ) : (
            <div className="expense-card">
              <div className="expense-header">
                <h2>{expense?.description}</h2>
                <div className="expense-actions">
                  <button onClick={() => setIsEditing(true)} className="edit-btn">
                    Edit
                  </button>
                  <button onClick={handleDelete} className="delete-btn">
                    Delete
                  </button>
                </div>
              </div>
              <div className="expense-details">
                <div className="detail-item">
                  <span className="detail-label">Amount:</span>
                  <span className="detail-value">{formatCurrency(expense?.amount)}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Category:</span>
                  <span className="category-badge">{expense?.category}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Date:</span>
                  <span className="detail-value">{formatDate(expense?.date)}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Created:</span>
                  <span className="detail-value">{formatDate(expense?.createdAt)}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ExpenseDetail;

