import React from 'react';
import { formatCurrency } from '../../utils/format';

const TopExpensesList = ({ expenses }) => {
  if (!expenses || expenses.length === 0) {
    return (
      <div className="chart-wrapper">
        <h3>Top 5 Expenses</h3>
        <div style={{ textAlign: 'center', padding: '50px', color: '#666' }}>
          No expenses recorded yet
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
            <span className="rank">{index + 1}.</span>
            <div className="expense-details">
              <span className="category">{expense.category}</span>
              {expense.notes && <span className="notes">• {expense.notes}</span>}
            </div>
            <span className="amount">{formatCurrency(expense.amount, expense.currency)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopExpensesList;