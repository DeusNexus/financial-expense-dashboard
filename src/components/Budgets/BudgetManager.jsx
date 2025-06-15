// src/components/Budgets/BudgetManager.jsx
import React, { useState } from 'react';
import Modal from 'react-modal';
import { useApp } from '../../context/AppContext';
import { EXPENSE_CATEGORIES } from '../../utils/constants';
import './BudgetManager.css';

const BudgetManager = ({ isOpen, onClose }) => {
  const { budgets, setBudget, deleteBudget } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [budgetAmount, setBudgetAmount] = useState('');

  const handleAddBudget = (e) => {
    e.preventDefault();
    if (selectedCategory && budgetAmount) {
      setBudget(selectedCategory, parseFloat(budgetAmount));
      setSelectedCategory('');
      setBudgetAmount('');
    }
  };

  const availableCategories = EXPENSE_CATEGORIES.filter(
    cat => !budgets.hasOwnProperty(cat)
  );

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="budget-manager-modal"
      overlayClassName="modal-overlay"
      ariaHideApp={false}
    >
      <div className="modal-header">
        <h2>Manage Budgets</h2>
        <button className="close-button" onClick={onClose}>×</button>
      </div>

      <div className="budget-manager-content">
        <form onSubmit={handleAddBudget} className="add-budget-form">
          <div className="form-row">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              required
            >
              <option value="">Select Category</option>
              {availableCategories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Monthly Budget (IDR)"
              value={budgetAmount}
              onChange={(e) => setBudgetAmount(e.target.value)}
              required
            />
            <button type="submit" className="btn-primary">Add Budget</button>
          </div>
        </form>

        <div className="existing-budgets">
          <h3>Current Budgets</h3>
          {Object.entries(budgets).length === 0 ? (
            <p>No budgets set yet.</p>
          ) : (
            <div className="budget-list">
              {Object.entries(budgets).map(([category, amount]) => (
                <div key={category} className="budget-item">
                  <span className="category-name">{category}</span>
                  <span className="budget-amount">Rp {amount.toLocaleString()}</span>
                  <button 
                    onClick={() => deleteBudget(category)}
                    className="btn-delete"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default BudgetManager;