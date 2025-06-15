// src/components/Goals/GoalsPage.jsx
import React, { useState } from 'react';
import CreatableSelect from 'react-select/creatable';
import { useApp } from '../../context/AppContext';
import { EXPENSE_CATEGORIES } from '../../utils/constants';
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

      <div className="goals-list">
        {goals.map(goal => (
          <div key={goal.id} className="goal-card">
            <h3>{goal.name}</h3>
            <p>Target: {goal.targetAmount} by {goal.targetDate}</p>
            {goal.category && <p>Category: {goal.category}</p>}
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ width: `${calculateProgress(goal)}%` }}
              ></div>
            </div>
            <p>{calculateProgress(goal).toFixed(1)}% Complete</p>
            <button onClick={() => deleteGoal(goal.id)}>Delete</button>
          </div>
        ))}
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
                  placeholder="Goal Name"
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