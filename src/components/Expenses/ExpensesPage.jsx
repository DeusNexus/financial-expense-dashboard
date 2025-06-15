// src/components/Expenses/ExpensesPage.jsx
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import ExpenseFormModal from './ExpenseFormModal';
import { formatCurrency, formatDate } from '../../utils/format';
import './ExpensesPage.css';

const ExpensesPage = () => {
  const { expenses, deleteExpense } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [filterCategory, setFilterCategory] = useState('all');

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      deleteExpense(id);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingExpense(null);
  };

  const filteredExpenses = expenses.filter(expense => 
    filterCategory === 'all' || expense.category === filterCategory
  );

  const categories = [...new Set(expenses.map(e => e.category).filter(Boolean))];

  return (
    <div className="expenses-page">
      <div className="page-header">
        <h1>Expenses</h1>
        <button 
          className="btn-primary"
          onClick={() => setShowForm(true)}
        >
          Add Expense
        </button>
      </div>

      <div className="filters">
        <select 
          value={filterCategory} 
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          <option value="all">All Categories</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div className="expenses-table">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Category</th>
              <th>Amount</th>
              <th>Type</th>
              <th>Notes</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredExpenses.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>
                  No expenses found
                </td>
              </tr>
            ) : (
              filteredExpenses.map(expense => (
                <tr key={expense.id}>
                  <td>{formatDate(expense.date)}</td>
                  <td>{expense.category}</td>
                  <td>{formatCurrency(expense.amount, expense.currency)}</td>
                  <td>
                    <span className={`type-badge ${expense.type}`}>
                      {expense.type === 'income' ? 'Income' : 'Expense'}
                    </span>
                  </td>
                  <td>{expense.notes || '-'}</td>
                  <td>
                    <button 
                      onClick={() => handleEdit(expense)}
                      className="btn-secondary btn-small"
                      style={{ marginRight: '5px' }}
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(expense.id)}
                      className="btn-danger btn-small"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <ExpenseFormModal
        isOpen={showForm}
        onClose={handleCloseForm}
        expense={editingExpense}
      />
    </div>
  );
};

export default ExpensesPage;