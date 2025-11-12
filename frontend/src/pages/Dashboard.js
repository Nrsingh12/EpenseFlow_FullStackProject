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
  
  // Filters and pagination
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [category, setCategory] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [pagination, setPagination] = useState(null);
  const [categories, setCategories] = useState([]);

  const fetchExpenses = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        sortBy,
        sortOrder,
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
      
      // Extract unique categories
      const uniqueCategories = [...new Set(data.expenses.map(e => e.category))];
      setCategories(uniqueCategories);
    } catch (err) {
      setError('Failed to fetch expenses');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, limit, sortBy, sortOrder, search, category, startDate, endDate, minAmount, maxAmount]);

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
  }, [fetchExpenses, fetchSummary]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (search !== undefined) {
        fetchExpenses();
      }
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [search, fetchExpenses]);

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

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <>
      <Navbar />
      <div className="dashboard">
        <div className="dashboard-container">
          <h1>Dashboard</h1>

          {/* Summary Cards */}
          {summary && (
            <div className="summary-cards">
              <div className="summary-card">
                <h3>Total Expenses</h3>
                <p className="summary-value">{summary.totalExpenses}</p>
              </div>
              <div className="summary-card">
                <h3>Total Amount</h3>
                <p className="summary-value">{formatCurrency(summary.totalAmount)}</p>
              </div>
              <div className="summary-card">
                <h3>Average Expense</h3>
                <p className="summary-value">{formatCurrency(summary.averageExpense)}</p>
              </div>
            </div>
          )}

          {/* Filters */}
          <div className="filters-section">
            <h2>Filters</h2>
            <div className="filters-grid">
              <div className="filter-group">
                <label>Search</label>
                <input
                  type="text"
                  placeholder="Search by description..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="filter-group">
                <label>Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                  <option value="">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div className="filter-group">
                <label>Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="filter-group">
                <label>End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
              <div className="filter-group">
                <label>Min Amount</label>
                <input
                  type="number"
                  placeholder="0"
                  value={minAmount}
                  onChange={(e) => setMinAmount(e.target.value)}
                />
              </div>
              <div className="filter-group">
                <label>Max Amount</label>
                <input
                  type="number"
                  placeholder="1000"
                  value={maxAmount}
                  onChange={(e) => setMaxAmount(e.target.value)}
                />
              </div>
            </div>
            <button onClick={clearFilters} className="clear-filters-btn">
              Clear Filters
            </button>
          </div>

          {/* Add Expense Button */}
          <div className="actions-bar">
            <Link to="/expense/add" className="add-expense-btn">
              + Add Expense
            </Link>
            <div className="pagination-controls">
              <label>
                Items per page:
                <select value={limit} onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }}>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </label>
            </div>
          </div>

          {/* Expenses Table */}
          {error && <div className="error-message">{error}</div>}
          {loading ? (
            <div className="loading">Loading expenses...</div>
          ) : expenses.length === 0 ? (
            <div className="no-expenses">No expenses found. Add your first expense!</div>
          ) : (
            <>
              <div className="table-container">
                <table className="expenses-table">
                  <thead>
                    <tr>
                      <th onClick={() => handleSort('description')}>
                        Description {sortBy === 'description' && (sortOrder === 'asc' ? '↑' : '↓')}
                      </th>
                      <th onClick={() => handleSort('amount')}>
                        Amount {sortBy === 'amount' && (sortOrder === 'asc' ? '↑' : '↓')}
                      </th>
                      <th onClick={() => handleSort('category')}>
                        Category {sortBy === 'category' && (sortOrder === 'asc' ? '↑' : '↓')}
                      </th>
                      <th onClick={() => handleSort('date')}>
                        Date {sortBy === 'date' && (sortOrder === 'asc' ? '↑' : '↓')}
                      </th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {expenses.map(expense => (
                      <tr key={expense.id}>
                        <td>{expense.description}</td>
                        <td>{formatCurrency(expense.amount)}</td>
                        <td><span className="category-badge">{expense.category}</span></td>
                        <td>{formatDate(expense.date)}</td>
                        <td>
                          <Link to={`/expense/${expense.id}`} className="action-link">View</Link>
                          <button onClick={() => handleDelete(expense.id)} className="delete-btn">
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className="pagination">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="pagination-btn"
                  >
                    Previous
                  </button>
                  <span className="pagination-info">
                    Page {pagination.page} of {pagination.totalPages} ({pagination.total} total)
                  </span>
                  <button
                    onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                    disabled={page === pagination.totalPages}
                    className="pagination-btn"
                  >
                    Next
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

