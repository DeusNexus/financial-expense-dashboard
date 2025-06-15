// src/components/Expenses/ExpenseFormModal.jsx
import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import CreatableSelect from 'react-select/creatable';
import { useApp } from '../../context/AppContext';
import { CURRENCIES, EXPENSE_CATEGORIES } from '../../utils/constants';
import { formatInputNumber, parseInputNumber } from '../../utils/format';
import OCRUpload from '../OCR/OCRUpload';
import 'react-datepicker/dist/react-datepicker.css';
import './ExpenseFormModal.css';

const ExpenseFormModal = ({ isOpen, onClose, expense = null }) => {
  const { addExpense, updateExpense, settings, expenses } = useApp();
  
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    date: new Date(),
    currency: settings.defaultCurrency,
    type: 'expense',
    notes: '',
    recurring: false,
    receiptImage: null
  });

  const [errors, setErrors] = useState({});
  const [showOCR, setShowOCR] = useState(false);
  const [formattedAmount, setFormattedAmount] = useState('');

  // Get existing categories from expenses
  const existingCategories = [...new Set(expenses.map(e => e.category).filter(Boolean))];
  const allCategories = [...new Set([...EXPENSE_CATEGORIES, ...existingCategories])];
  const categoryOptions = allCategories.map(cat => ({
    value: cat,
    label: cat
  }));

  useEffect(() => {
    if (expense) {
      setFormData({
        ...expense,
        date: new Date(expense.date)
      });
      setFormattedAmount(formatInputNumber(expense.amount.toString()));
    } else {
      setFormData({
        amount: '',
        category: '',
        date: new Date(),
        currency: settings.defaultCurrency,
        type: 'expense',
        notes: '',
        recurring: false,
        receiptImage: null
      });
      setFormattedAmount('');
    }
  }, [expense, settings.defaultCurrency, isOpen]);

  const currencyOptions = CURRENCIES.map(curr => ({
    value: curr.code,
    label: `${curr.symbol} ${curr.code}`
  }));

  const validateForm = () => {
    const newErrors = {};
    
    const numericAmount = parseInputNumber(formattedAmount);
    if (!formattedAmount || numericAmount <= 0) {
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
      amount: parseInputNumber(formattedAmount),
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

  const handleAmountChange = (e) => {
    const value = e.target.value;
    // Allow only numbers and dots
    const numericValue = value.replace(/[^\d]/g, '');
    const formatted = formatInputNumber(numericValue);
    setFormattedAmount(formatted);
    if (errors.amount) {
      setErrors(prev => ({ ...prev, amount: null }));
    }
  };

  const handleOCRData = async (ocrData) => {
    const data = await ocrData;
    setFormData(prev => ({
      ...prev,
      ...data,
      date: data.date || prev.date
    }));
    setFormattedAmount(formatInputNumber(data.amount.toString()));
    setShowOCR(false);
  };

  const handleCategoryCreate = (inputValue) => {
    const newOption = { value: inputValue, label: inputValue };
    handleInputChange('category', inputValue);
    return newOption;
  };

  const getCurrencySymbol = (currency) => {
    const curr = CURRENCIES.find(c => c.code === currency);
    return curr ? curr.symbol : currency;
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>{expense ? 'Edit Expense' : 'Add New Expense'}</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        {showOCR ? (
          <OCRUpload 
            onDataExtracted={handleOCRData}
            onClose={() => setShowOCR(false)}
          />
        ) : (
          <form onSubmit={handleSubmit} className="expense-form">
            <div className="form-actions-top">
              <button 
                type="button" 
                onClick={() => setShowOCR(true)}
                className="btn-secondary"
              >
                📷 Scan Receipt
              </button>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="amount">Amount *</label>
                <div className={`amount-input-container ${errors.amount ? 'error' : ''}`}>
                  <span className="currency-prefix">
                    {getCurrencySymbol(formData.currency)}
                  </span>
                  <input
                    id="amount"
                    type="text"
                    value={formattedAmount}
                    onChange={handleAmountChange}
                    placeholder={formData.currency === 'IDR' ? '1.000.000' : '1000.00'}
                  />
                </div>
                {errors.amount && <span className="error-text">{errors.amount}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="currency">Currency</label>
                <CreatableSelect
                  options={currencyOptions}
                  value={currencyOptions.find(opt => opt.value === formData.currency)}
                  onChange={(option) => handleInputChange('currency', option.value)}
                  className="select-container"
                  classNamePrefix="select"
                  isSearchable={false}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="category">Category *</label>
                <CreatableSelect
                  options={categoryOptions}
                  value={categoryOptions.find(opt => opt.value === formData.category)}
                  onChange={(option) => handleInputChange('category', option ? option.value : '')}
                  onCreateOption={handleCategoryCreate}
                  className={`select-container ${errors.category ? 'error' : ''}`}
                  classNamePrefix="select"
                  placeholder="Select or create category..."
                  isClearable
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

            {formData.receiptImage && (
              <div className="receipt-preview">
                <img src={formData.receiptImage} alt="Receipt" />
                <button 
                  type="button" 
                  onClick={() => handleInputChange('receiptImage', null)}
                  className="remove-image"
                >
                  ×
                </button>
              </div>
            )}

            <div className="modal-actions">
              <button type="button" onClick={onClose} className="btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                {expense ? 'Update' : 'Add'} Expense
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ExpenseFormModal;