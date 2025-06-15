import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import ExpenseFormModal from './ExpenseFormModal';
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

  const filteredExpenses = expenses.filter(expense => 
    filterCategory === 'all' || expense.category === filterCategory
  );

  const categories = [...new Set(expenses.map(e => e.category))];

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
              <th>Notes</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredExpenses.map(expense => (
              <tr key={expense.id}>
                <td>{new Date(expense.date).toLocaleDateString()}</td>
                <td>{expense.category}</td>
                <td>{expense.currency} {expense.amount}</td>
                <td>{expense.notes}</td>
                <td>
                  <button onClick={() => handleEdit(expense)}>Edit</button>
                  <button onClick={() => handleDelete(expense.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <ExpenseFormModal
          isOpen={showForm}
          onClose={() => {
            setShowForm(false);
            setEditingExpense(null);
          }}
          expense={editingExpense}
        />
      )}
    </div>
  );
};

export default ExpensesPage;