// src/components/Budgets/BudgetCard.jsx
import React from 'react';
import { useApp } from '../../context/AppContext';
import { formatCurrency } from '../../utils/format';
import './BudgetCard.css';

const BudgetCard = ({ category, budget, spent, totalSpent }) => {
  const { settings, convertToEUR } = useApp();
  
  const usagePercent = budget > 0 ? (spent / budget) * 100 : 0;
  
  const getProgressColor = (percent) => {
    if (percent <= 80) return '#4caf50';
    if (percent <= 100) return '#ff9800';
    return '#f44336';
  };

  return (
    <div className="budget-card">
      <div className="budget-header">
        <h4>{category}</h4>
        <div className="budget-amount">
          {formatCurrency(budget, 'IDR')}
          {settings.showEurEquivalent && (
            <span className="eur-equivalent">
              ≈ {formatCurrency(convertToEUR(budget), 'EUR')}
            </span>
          )}
        </div>
      </div>

      <div className="budget-progress">
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ 
              width: `${Math.min(usagePercent, 100)}%`,
              backgroundColor: getProgressColor(usagePercent)
            }}
          />
        </div>
        <div className="progress-info">
          <span>{formatCurrency(spent, 'IDR')} spent</span>
          <span>{usagePercent.toFixed(1)}%</span>
        </div>
      </div>

      {usagePercent > 100 && (
        <div className="overspent-alert">
          ⚠️ Over budget by {formatCurrency(spent - budget, 'IDR')}
        </div>
      )}
    </div>
  );
};

export default BudgetCard;