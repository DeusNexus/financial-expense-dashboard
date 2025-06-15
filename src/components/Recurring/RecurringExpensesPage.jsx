// src/components/Recurring/RecurringExpensesPage.jsx
import React, { useState } from 'react';
import CreatableSelect from 'react-select/creatable';
import { useApp } from '../../context/AppContext';
import { formatDate, formatCurrency } from '../../utils/format';
import { EXPENSE_CATEGORIES, RECURRENCE_INTERVALS } from '../../utils/constants';
import './RecurringExpensesPage.css';

const RecurringExpensesPage = () => {
  const { 
    recurringExpenses, 
    addRecurringExpense, 
    deleteRecurringExpense, 
    addExpense,
    getNextDueDate,
    expenses
  } = useApp();
  
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    category: '',
    interval: 'monthly',
    currency: 'IDR',
    lastPaid: new Date().toISOString().split('T')[0]
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
    addRecurringExpense({
      ...formData,
      amount: parseFloat(formData.amount),
      lastPaid: new Date(formData.lastPaid).toISOString()
    });
    setFormData({
      name: '',
      amount: '',
      category: '',
      interval: 'monthly',
      currency: 'IDR',
      lastPaid: new Date().toISOString().split('T')[0]
    });
    setShowForm(false);
  };

  const handleMarkAsPaid = (recurring) => {
    const nextDue = getNextDueDate(recurring);
    
    const newExpense = {
      amount: recurring.amount,
      category: recurring.category,
      currency: recurring.currency,
      date: nextDue.toISOString(),
      type: 'expense',
      notes: `${recurring.name} (Manual)`,
      recurringId: recurring.id
    };
    
    addExpense(newExpense);
  };

  const handleCategoryCreate = (inputValue) => {
    setFormData(prev => ({ ...prev, category: inputValue }));
  };

  const upcomingExpenses = recurringExpenses.map(recurring => ({
    ...recurring,
    nextDue: getNextDueDate(recurring)
  })).sort((a, b) => a.nextDue - b.nextDue);

  return (
    <div className="recurring-page">
      <div className="page-header">
        <h1>Recurring Expenses</h1>
        <button 
          className="btn-primary"
          onClick={() => setShowForm(true)}
        >
          Add Recurring Expense
        </button>
      </div>

      <div className="upcoming-expenses">
        <h2>Upcoming Expenses</h2>
        {upcomingExpenses.length === 0 ? (
          <p>No recurring expenses set up.</p>
        ) : (
          <div className="expense-list">
            {upcomingExpenses.map(expense => {
              const isOverdue = expense.nextDue < new Date();
              return (
                <div key={expense.id} className={`expense-card ${isOverdue ? 'overdue' : ''}`}>
                  <div className="expense-info">
                    <h3>{expense.name}</h3>
                    <p className="category">{expense.category}</p>
                    <p className="interval">Repeats {expense.interval}</p>
                  </div>
                  <div className="expense-details">
                    <div className="amount">
                      {formatCurrency(expense.amount, expense.currency)}
                    </div>
                    <div className={`due-date ${isOverdue ? 'overdue' : ''}`}>
                      {isOverdue ? 'Overdue: ' : 'Due: '}
                      {formatDate(expense.nextDue)}
                    </div>
                  </div>
                  <div className="expense-actions">
                    <button 
                      onClick={() => handleMarkAsPaid(expense)}
                      className="btn-primary btn-small"
                    >
                      Mark as Paid
                    </button>
                    <button 
                      onClick={() => deleteRecurringExpense(expense.id)}
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
            <h2>Add Recurring Expense</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Amount</label>
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
                  <label>Frequency</label>
                  <select
                    value={formData.interval}
                    onChange={(e) => setFormData({...formData, interval: e.target.value})}
                  >
                    {RECURRENCE_INTERVALS.map(interval => (
                      <option key={interval.value} value={interval.value}>
                        {interval.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Last Paid Date</label>
                <input
                  type="date"
                  value={formData.lastPaid}
                  onChange={(e) => setFormData({...formData, lastPaid: e.target.value})}
                  required
                />
              </div>

              <div className="modal-actions">
                <button type="button" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit">Add Recurring Expense</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecurringExpensesPage;