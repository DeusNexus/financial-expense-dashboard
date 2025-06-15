// src/components/Planned/PlannedExpensesPage.jsx
import React, { useState } from 'react';
import CreatableSelect from 'react-select/creatable';
import { useApp } from '../../context/AppContext';
import { formatDate, formatCurrency } from '../../utils/format';
import { EXPENSE_CATEGORIES } from '../../utils/constants';
import './PlannedExpensesPage.css';

const PlannedExpensesPage = () => {
  const { plannedExpenses, addPlannedExpense, deletePlannedExpense, addExpense, expenses } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    targetDate: '',
    category: '',
    currency: 'IDR',
    notes: ''
  });

  // Get existing categories from expenses
  const existingCategories = [...new Set(expenses.map(e => e.category).filter(Boolean))];
  const allCategories = [...new Set([...EXPENSE_CATEGORIES, ...existingCategories])];
  const categoryOptions = allCategories.map(cat => ({
    value: cat,
    label: cat
  }));

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

  const handleCategoryCreate = (inputValue) => {
    setFormData(prev => ({ ...prev, category: inputValue }));
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
          <div className="empty-state-container">
            <div className="empty-state-card">
              <div className="empty-state-icon">📅</div>
              <h3>No Planned Expenses</h3>
              <p>Start planning ahead! Add upcoming one-time expenses like vacations, major purchases, or annual payments to better manage your budget.</p>
              <button 
                className="btn-primary"
                onClick={() => setShowForm(true)}
              >
                Plan Your First Expense
              </button>
            </div>
          </div>
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
                  <CreatableSelect
                    options={categoryOptions}
                    value={categoryOptions.find(opt => opt.value === formData.category)}
                    onChange={(option) => setFormData({...formData, category: option ? option.value : ''})}
                    onCreateOption={handleCategoryCreate}
                    className="select-container"
                    classNamePrefix="select"
                    placeholder="Select or create category..."
                    isClearable
                  />
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