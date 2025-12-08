import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../utils/api';
import './Dashboard.css';

const Dashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [summary, setSummary] = useState(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [pagination, setPagination] = useState(null);
  const [categories, setCategories] = useState([]);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const fetchExpenses = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        sortBy: 'date',
        sortOrder: 'desc',
        ...(search && { search }),
        ...(category && { category }),
        ...(startDate && { startDate }),
        ...(endDate && { endDate }),
        ...(minAmount && { minAmount }),
        ...(maxAmount && { maxAmount })
      });

      const data = await api.get(`/api/expenses?${params}`);
      setExpenses(data.expenses);
      setPagination(data.pagination);
    } catch (err) {
      setError('Failed to fetch expenses');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, category, startDate, endDate, minAmount, maxAmount]);

  const fetchCategories = useCallback(async () => {
    try {
      const data = await api.get('/api/analytics/summary');
      if (data.categoryTotals) {
        setCategories(Object.keys(data.categoryTotals));
      }
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  }, []);

  const fetchSummary = useCallback(async () => {
    try {
      const data = await api.get('/api/analytics/summary');
      setSummary(data);
    } catch (err) {
      console.error('Failed to fetch summary:', err);
    }
  }, []);

  useEffect(() => {
    fetchExpenses();
    fetchSummary();
    fetchCategories();
  }, [fetchExpenses, fetchSummary, fetchCategories]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (search !== undefined) {
        setPage(1);
      }
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [search]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await api.delete(`/api/expenses/${id}`);
        fetchExpenses();
        fetchSummary();
      } catch (err) {
        setError('Failed to delete expense');
      }
    }
  };

  const clearFilters = () => {
    setSearch('');
    setCategory('');
    setStartDate('');
    setEndDate('');
    setMinAmount('');
    setMaxAmount('');
    setPage(1);
  };

  const hasActiveFilters = search || category || startDate || endDate || minAmount || maxAmount;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <>
      <Navbar />
      <div className="dashboard">
        <div className="dashboard-container">
          <div className="dashboard-header">
            <h1>Dashboard</h1>
            <Link to="/expense/add" className="add-expense-btn">
              + Add Expense
            </Link>
          </div>

          {summary && (
            <div className="summary-cards">
              <div className="summary-card">
                <div className="summary-icon">📊</div>
                <div className="summary-content">
                  <h3>Total Expenses</h3>
                  <p className="summary-value">{summary.totalExpenses}</p>
                </div>
              </div>
              <div className="summary-card">
                <div className="summary-icon">💰</div>
                <div className="summary-content">
                  <h3>Total Spent</h3>
                  <p className="summary-value">{formatCurrency(summary.totalAmount)}</p>
                </div>
              </div>
              <div className="summary-card">
                <div className="summary-icon">📈</div>
                <div className="summary-content">
                  <h3>Average</h3>
                  <p className="summary-value">{formatCurrency(summary.averageExpense)}</p>
                </div>
              </div>
            </div>
          )}

          <div className="filters-section">
            <div className="filters-bar">
              <input
                type="text"
                placeholder="🔍 Search expenses..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="search-input"
              />
              <select 
                value={category} 
                onChange={(e) => setCategory(e.target.value)}
                className="category-filter"
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <div className="items-per-page">
                <label>Show:</label>
                <select 
                  value={limit} 
                  onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }}
                  className="limit-select"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>
              <button 
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)} 
                className="advanced-filters-btn"
              >
                {showAdvancedFilters ? '▲ Hide Filters' : '▼ More Filters'}
              </button>
              {hasActiveFilters && (
                <button onClick={clearFilters} className="clear-filters-btn">
                  Clear All
                </button>
              )}
            </div>

            {showAdvancedFilters && (
              <div className="advanced-filters">
                <div className="filter-group">
                  <label>Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="date-input"
                  />
                </div>
                <div className="filter-group">
                  <label>End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="date-input"
                  />
                </div>
                <div className="filter-group">
                  <label>Min Amount (₹)</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={minAmount}
                    onChange={(e) => setMinAmount(e.target.value)}
                    className="amount-input"
                  />
                </div>
                <div className="filter-group">
                  <label>Max Amount (₹)</label>
                  <input
                    type="number"
                    placeholder="10000"
                    value={maxAmount}
                    onChange={(e) => setMaxAmount(e.target.value)}
                    className="amount-input"
                  />
                </div>
              </div>
            )}
          </div>

          {error && <div className="error-message">{error}</div>}
          
          {loading ? (
            <div className="loading">Loading expenses...</div>
          ) : expenses.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📝</div>
              <h3>No Expenses Found</h3>
              <p>Start tracking your expenses by adding your first one!</p>
              <Link to="/expense/add" className="empty-add-btn">
                + Add Your First Expense
              </Link>
            </div>
          ) : (
            <>
              <div className="expenses-list">
                {expenses.map(expense => (
                  <div key={expense.id} className="expense-item">
                    <div className="expense-main">
                      <div className="expense-info">
                        <h3 className="expense-description">{expense.description}</h3>
                        <div className="expense-details">
                          <span className="expense-category">{expense.category}</span>
                          <span className="expense-date">{formatDate(expense.date)}</span>
                        </div>
                      </div>
                      <div className="expense-amount">{formatCurrency(expense.amount)}</div>
                    </div>
                    <div className="expense-actions">
                      <Link to={`/expense/${expense.id}`} className="action-btn view-btn">
                        View Details
                      </Link>
                      <button onClick={() => handleDelete(expense.id)} className="action-btn delete-btn">
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {pagination && pagination.totalPages > 1 && (
                <div className="pagination">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="pagination-btn"
                  >
                    ← Previous
                  </button>
                  <span className="pagination-info">
                    Page {pagination.page} of {pagination.totalPages}
                  </span>
                  <button
                    onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                    disabled={page === pagination.totalPages}
                    className="pagination-btn"
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
