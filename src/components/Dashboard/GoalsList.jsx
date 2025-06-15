// src/components/Dashboard/GoalsList.jsx
import React from 'react';
import { useApp } from '../../context/AppContext';
import { formatCurrency } from '../../utils/format';

const GoalsList = () => {
  const { goals, expenses } = useApp();

  const calculateProgress = (goal) => {
    const totalSavings = expenses.reduce((sum, expense) => {
      return expense.type === 'income' ? sum + expense.amount : sum - expense.amount;
    }, 0);
    return Math.min((totalSavings / goal.targetAmount) * 100, 100);
  };

  const activeGoals = goals.slice(0, 3); // Show top 3 goals

  if (activeGoals.length === 0) {
    return (
      <div className="chart-wrapper">
        <h3>Savings Goals</h3>
        <div className="empty-state">
          <p>No goals set</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chart-wrapper">
      <h3>Savings Goals</h3>
      <div className="goals-list">
        {activeGoals.map((goal) => {
          const progress = calculateProgress(goal);
          return (
            <div key={goal.id} className="goal-item">
              <div className="goal-content">
                <div className="goal-main">
                  <span className="goal-name">{goal.name}</span>
                  <span className="goal-target">{formatCurrency(goal.targetAmount)}</span>
                </div>
                <div className="goal-progress">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <span className="progress-text">{progress.toFixed(1)}%</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GoalsList;