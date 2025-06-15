// src/components/Planned/PlannedExpensesPage.jsx
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatDate, formatCurrency } from '../../utils/format';
import { EXPENSE_CATEGORIES } from '../../utils/constants';
import './PlannedExpensesPage.css';

const PlannedExpensesPage = () => {
  const { plannedExpenses, addPlannedExpense, deletePlannedExpense, addExpense } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    targetDate: '',
    category: '',
    currency: 'IDR',
    notes: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    addPlannedExpense({
      ...formData,
      amount: parseFloat(formData.amount),
      targetDate: new Date(formData.targetDate).toISOString()
    });
    setFormData({
      title: '',
      amount: '',
      targetDate: '',
      category: '',
      currency: 'IDR',
      notes: ''
    });
    setShowForm(false);
  };

  const convertToExpense = (plannedExpense) => {
    const newExpense = {
      amount: plannedExpense.amount,
      category: plannedExpense.category,
      currency: plannedExpense.currency,
      date: new Date().toISOString(),
      type: 'expense',
      notes: plannedExpense.title + (plannedExpense.notes ? ` - ${plannedExpense.notes}` : '')
    };
    
    addExpense(newExpense);
    deletePlannedExpense(plannedExpense.id);
  };

  const sortedPlannedExpenses = [...plannedExpenses].sort((a, b) => 
    new Date(a.targetDate) - new Date(b.targetDate)
  );

  return (
    <div className="planned-page">
      <div className="page-header">
        <h1>Planned Expenses</h1>
        <button 
          className="btn-primary"
          onClick={() => setShowForm(true)}
        >
          Add Planned Expense
        </button>
      </div>

      <div className="planned-expenses">
        {sortedPlannedExpenses.length === 0 ? (
          <p>No planned expenses yet.</p>
        ) : (
          <div className="expense-list">
            {sortedPlannedExpenses.map(expense => {
              const isPastDue = new Date(expense.targetDate) < new Date();
              return (
                <div key={expense.id} className={`expense-card ${isPastDue ? 'past-due' : ''}`}>
                  <div className="expense-info">
                    <h3>{expense.title}</h3>
                    {expense.category && <p className="category">{expense.category}</p>}
                    {expense.notes && <p className="notes">{expense.notes}</p>}
                  </div>
                  <div className="expense-details">
                    <div className="amount">
                      {formatCurrency(expense.amount, expense.currency)}
                    </div>
                    <div className={`target-date ${isPastDue ? 'past-due' : ''}`}>
                      {isPastDue ? 'Was due: ' : 'Due: '}
                      {formatDate(expense.targetDate)}
                    </div>
                  </div>
                  <div className="expense-actions">
                    <button 
                      onClick={() => convertToExpense(expense)}
                      className="btn-primary btn-small"
                    >
                      Convert to Expense
                    </button>
                    <button 
                      onClick={() => deletePlannedExpense(expense.id)}
                      className="btn-danger btn-small"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showForm && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Add Planned Expense</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Expected Amount</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Currency</label>
                  <select
                    value={formData.currency}
                    onChange={(e) => setFormData({...formData, currency: e.target.value})}
                  >
                    <option value="IDR">IDR</option>
                    <option value="EUR">EUR</option>
                    <option value="USD">USD</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                  >
                    <option value="">Select Category (Optional)</option>
                    {EXPENSE_CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Target Date</label>
                  <input
                    type="date"
                    value={formData.targetDate}
                    onChange={(e) => setFormData({...formData, targetDate: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  rows="3"
                  placeholder="Optional notes..."
                />
              </div>

              <div className="modal-actions">
                <button type="button" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit">Add Planned Expense</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlannedExpensesPage;