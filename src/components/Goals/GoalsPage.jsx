import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
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
              <input
                type="text"
                placeholder="Goal Name"
                value={newGoal.name}
                onChange={(e) => setNewGoal({...newGoal, name: e.target.value})}
                required
              />
              <input
                type="number"
                placeholder="Target Amount"
                value={newGoal.targetAmount}
                onChange={(e) => setNewGoal({...newGoal, targetAmount: e.target.value})}
                required
              />
              <input
                type="date"
                value={newGoal.targetDate}
                onChange={(e) => setNewGoal({...newGoal, targetDate: e.target.value})}
                required
              />
              <input
                type="text"
                placeholder="Category (optional)"
                value={newGoal.category}
                onChange={(e) => setNewGoal({...newGoal, category: e.target.value})}
              />
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