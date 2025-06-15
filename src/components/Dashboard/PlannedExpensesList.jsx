// src/components/Dashboard/PlannedExpensesList.jsx
import React from 'react';
import { useApp } from '../../context/AppContext';
import { formatCurrency, formatDate } from '../../utils/format';

const PlannedExpensesList = () => {
  const { plannedExpenses } = useApp();

  const upcomingPlanned = plannedExpenses
    .filter(expense => new Date(expense.targetDate) >= new Date())
    .sort((a, b) => new Date(a.targetDate) - new Date(b.targetDate))
    .slice(0, 5);

  if (upcomingPlanned.length === 0) {
    return (
      <div className="chart-wrapper">
        <h3>Upcoming Planned Expenses</h3>
        <div className="empty-state">
          <p>No planned expenses</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chart-wrapper">
      <h3>Upcoming Planned Expenses</h3>
      <div className="planned-expenses-list">
        {upcomingPlanned.map((expense, index) => (
          <div key={expense.id} className="planned-item">
            <div className="planned-content">
              <div className="planned-main">
                <span className="title">{expense.title}</span>
                <span className="amount">{formatCurrency(expense.amount, expense.currency)}</span>
              </div>
              <div className="planned-date">Due: {formatDate(expense.targetDate)}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlannedExpensesList;