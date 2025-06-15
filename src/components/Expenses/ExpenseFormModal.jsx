import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import DatePicker from 'react-datepicker';
import Select from 'react-select';
import { useApp } from '../../context/AppContext';
import { EXPENSE_CATEGORIES, CURRENCIES } from '../../utils/constants';
import 'react-datepicker/dist/react-datepicker.css';
import './ExpenseFormModal.css';

const ExpenseFormModal = ({ isOpen, onClose, expense = null }) => {
  const { addExpense, updateExpense, settings } = useApp();
  
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    date: new Date(),
    currency: settings.defaultCurrency,
    type: 'expense',
    notes: '',
    recurring: false
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (expense) {
      setFormData({
        ...expense,
        date: new Date(expense.date)
      });
    } else {
      setFormData({
        amount: '',
        category: '',
        date: new Date(),
        currency: settings.defaultCurrency,
        type: 'expense',
        notes: '',
        recurring: false
      });
    }
  }, [expense, settings.defaultCurrency, isOpen]);

  const categoryOptions = EXPENSE_CATEGORIES.map(cat => ({
    value: cat,
    label: cat
  }));

  const currencyOptions = CURRENCIES.map(curr => ({
    value: curr.code,
    label: `${curr.symbol} ${curr.code}`
  }));

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }
    
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const expenseData = {
      ...formData,
      amount: parseFloat(formData.amount),
      date: formData.date.toISOString()
    };

    if (expense) {
      updateExpense(expenseData);
    } else {
      addExpense(expenseData);
    }

    onClose();
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="expense-modal"
      overlayClassName="expense-modal-overlay"
      ariaHideApp={false}
    >
      <div className="modal-header">
        <h2>{expense ? 'Edit Expense' : 'Add New Expense'}</h2>
        <button className="close-button" onClick={onClose}>×</button>
      </div>

      <form onSubmit={handleSubmit} className="expense-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="amount">Amount *</label>
            <input
              id="amount"
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) => handleInputChange('amount', e.target.value)}
              className={errors.amount ? 'error' : ''}
              placeholder="0.00"
            />
            {errors.amount && <span className="error-text">{errors.amount}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="currency">Currency</label>
            <Select
              options={currencyOptions}
              value={currencyOptions.find(opt => opt.value === formData.currency)}
              onChange={(option) => handleInputChange('currency', option.value)}
              className="select-container"
              classNamePrefix="select"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="category">Category *</label>
            <Select
              options={categoryOptions}
              value={categoryOptions.find(opt => opt.value === formData.category)}
              onChange={(option) => handleInputChange('category', option.value)}
              className={`select-container ${errors.category ? 'error' : ''}`}
              classNamePrefix="select"
              isCreatable
            />
            {errors.category && <span className="error-text">{errors.category}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="date">Date</label>
            <DatePicker
              selected={formData.date}
              onChange={(date) => handleInputChange('date', date)}
              className="date-picker"
              dateFormat="dd/MM/yyyy"
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="type">Type</label>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                value="expense"
                checked={formData.type === 'expense'}
                onChange={(e) => handleInputChange('type', e.target.value)}
              />
              Expense
            </label>
            <label>
              <input
                type="radio"
                value="income"
                checked={formData.type === 'income'}
                onChange={(e) => handleInputChange('type', e.target.value)}
              />
              Income
            </label>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="notes">Notes</label>
          <textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => handleInputChange('notes', e.target.value)}
            placeholder="Optional notes..."
            rows="3"
          />
        </div>

        <div className="form-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={formData.recurring}
              onChange={(e) => handleInputChange('recurring', e.target.checked)}
            />
            Make this recurring (monthly)
          </label>
        </div>

        <div className="form-actions">
          <button type="button" onClick={onClose} className="btn-secondary">
            Cancel
          </button>
          <button type="submit" className="btn-primary">
            {expense ? 'Update' : 'Add'} Expense
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ExpenseFormModal;