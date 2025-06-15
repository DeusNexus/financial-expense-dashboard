// src/components/Dashboard/TopExpensesList.jsx
import React from 'react';
import { formatCurrency } from '../../utils/format';

const TopExpensesList = ({ expenses }) => {
  if (!expenses || expenses.length === 0) {
    return (
      <div className="chart-wrapper">
        <h3>Top 5 Expenses</h3>
        <div className="empty-state">
          <p>No expenses recorded yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chart-wrapper">
      <h3>Top 5 Expenses</h3>
      <div className="top-expenses-list">
        {expenses.map((expense, index) => (
          <div key={expense.id} className="expense-item">
            <div className="rank">{index + 1}</div>
            <div className="expense-content">
              <div className="expense-main">
                <span className="category">{expense.category}</span>
                <span className="amount">{formatCurrency(expense.amount, expense.currency)}</span>
              </div>
              {expense.notes && (
                <div className="expense-notes">{expense.notes}</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopExpensesList;