// src/components/Goals/GoalsPage.jsx
import React, { useState } from 'react';
import CreatableSelect from 'react-select/creatable';
import { useApp } from '../../context/AppContext';
import { EXPENSE_CATEGORIES } from '../../utils/constants';
import { formatCurrency } from '../../utils/format';
import './GoalsPage.css';

const GoalsPage = () => {
  const { goals, expenses, addGoal, deleteGoal } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [newGoal, setNewGoal] = useState({
    name: '',
    targetAmount: '',
    targetDate: '',
    category: ''
  });

  // Get existing categories from expenses
  const existingCategories = [...new Set(expenses.map(e => e.category).filter(Boolean))];
  const allCategories = [...new Set([...EXPENSE_CATEGORIES, ...existingCategories])];
  const categoryOptions = allCategories.map(cat => ({
    value: cat,
    label: cat
  }));

  const calculateProgress = (goal) => {
    const totalSavings = expenses.reduce((sum, expense) => {
      return expense.type === 'income' ? sum + expense.amount : sum - expense.amount;
    }, 0);
    return Math.min((totalSavings / goal.targetAmount) * 100, 100);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addGoal({
      ...newGoal,
      targetAmount: parseFloat(newGoal.targetAmount)
    });
    setNewGoal({ name: '', targetAmount: '', targetDate: '', category: '' });
    setShowForm(false);
  };

  const handleCategoryCreate = (inputValue) => {
    setNewGoal(prev => ({ ...prev, category: inputValue }));
  };

  return (
    <div className="goals-page">
      <div className="page-header">
        <h1>Savings Goals</h1>
        <button 
          className="btn-primary"
          onClick={() => setShowForm(true)}
        >
          Add Goal
        </button>
      </div>

      <div className="goals-content">
        {goals.length === 0 ? (
          <div className="empty-state-container">
            <div className="empty-state-card">
              <div className="empty-state-icon">🎯</div>
              <h3>No Savings Goals</h3>
              <p>Set meaningful savings goals to stay motivated! Whether it's for a vacation, emergency fund, or major purchase, tracking your progress makes saving easier.</p>
              <button 
                className="btn-primary"
                onClick={() => setShowForm(true)}
              >
                Create Your First Goal
              </button>
            </div>
          </div>
        ) : (
          <div className="goals-list">
            {goals.map(goal => {
              const progress = calculateProgress(goal);
              return (
                <div key={goal.id} className="goal-card">
                  <div className="goal-header">
                    <h3>{goal.name}</h3>
                    <button 
                      onClick={() => deleteGoal(goal.id)}
                      className="btn-danger btn-small"
                    >
                      Delete
                    </button>
                  </div>
                  <div className="goal-details">
                    <p className="goal-target">
                      Target: <strong>{formatCurrency(goal.targetAmount)}</strong> by {new Date(goal.targetDate).toLocaleDateString()}
                    </p>
                    {goal.category && <p className="goal-category">Category: {goal.category}</p>}
                  </div>
                  <div className="progress-section">
                    <div className="progress-bar">
                      <div 
                        className="progress-fill"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    <div className="progress-info">
                      <span className="progress-percentage">{progress.toFixed(1)}% Complete</span>
                      <span className="progress-amount">
                        {formatCurrency((progress / 100) * goal.targetAmount)} of {formatCurrency(goal.targetAmount)}
                      </span>
                    </div>
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
            <h2>Add New Goal</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Goal Name</label>
                <input
                  type="text"
                  placeholder="e.g., Emergency Fund, Vacation, New Laptop"
                  value={newGoal.name}
                  onChange={(e) => setNewGoal({...newGoal, name: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Target Amount</label>
                <input
                  type="number"
                  placeholder="Target Amount"
                  value={newGoal.targetAmount}
                  onChange={(e) => setNewGoal({...newGoal, targetAmount: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Target Date</label>
                <input
                  type="date"
                  value={newGoal.targetDate}
                  onChange={(e) => setNewGoal({...newGoal, targetDate: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Category (optional)</label>
                <CreatableSelect
                  options={categoryOptions}
                  value={categoryOptions.find(opt => opt.value === newGoal.category)}
                  onChange={(option) => setNewGoal({...newGoal, category: option ? option.value : ''})}
                  onCreateOption={handleCategoryCreate}
                  className="select-container"
                  classNamePrefix="select"
                  placeholder="Select or create category..."
                  isClearable
                />
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit">Add Goal</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoalsPage;