// src/context/AppContext.jsx
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { addMonths, addWeeks, addYears, isAfter, parseISO } from 'date-fns';

const AppContext = createContext();

const initialState = {
  expenses: [],
  goals: [],
  budgets: {},
  recurringExpenses: [],
  plannedExpenses: [],
  exchangeRates: [],
  settings: {
    defaultCurrency: 'IDR',
    exchangeRate: 16500, // IDR per 1 EUR
    showEurEquivalent: true,
    autoAddRecurring: true,
    theme: 'light'
  }
};

const appReducer = (state, action) => {
  switch (action.type) {
    case 'LOAD_DATA':
      return { ...state, ...action.payload };
    
    case 'ADD_EXPENSE':
      return {
        ...state,
        expenses: [...state.expenses, { ...action.payload, id: uuidv4() }]
      };
    
    case 'UPDATE_EXPENSE':
      return {
        ...state,
        expenses: state.expenses.map(expense =>
          expense.id === action.payload.id ? action.payload : expense
        )
      };
    
    case 'DELETE_EXPENSE':
      return {
        ...state,
        expenses: state.expenses.filter(expense => expense.id !== action.payload)
      };
    
    case 'ADD_GOAL':
      return {
        ...state,
        goals: [...state.goals, { ...action.payload, id: uuidv4() }]
      };
    
    case 'UPDATE_GOAL':
      return {
        ...state,
        goals: state.goals.map(goal =>
          goal.id === action.payload.id ? action.payload : goal
        )
      };
    
    case 'DELETE_GOAL':
      return {
        ...state,
        goals: state.goals.filter(goal => goal.id !== action.payload)
      };

    case 'SET_BUDGET':
      return {
        ...state,
        budgets: { ...state.budgets, [action.payload.category]: action.payload.amount }
      };

    case 'DELETE_BUDGET':
      const newBudgets = { ...state.budgets };
      delete newBudgets[action.payload];
      return { ...state, budgets: newBudgets };

    case 'ADD_RECURRING_EXPENSE':
      return {
        ...state,
        recurringExpenses: [...state.recurringExpenses, { ...action.payload, id: uuidv4() }]
      };

    case 'UPDATE_RECURRING_EXPENSE':
      return {
        ...state,
        recurringExpenses: state.recurringExpenses.map(expense =>
          expense.id === action.payload.id ? action.payload : expense
        )
      };

    case 'DELETE_RECURRING_EXPENSE':
      return {
        ...state,
        recurringExpenses: state.recurringExpenses.filter(expense => expense.id !== action.payload)
      };

    case 'ADD_PLANNED_EXPENSE':
      return {
        ...state,
        plannedExpenses: [...state.plannedExpenses, { ...action.payload, id: uuidv4() }]
      };

    case 'UPDATE_PLANNED_EXPENSE':
      return {
        ...state,
        plannedExpenses: state.plannedExpenses.map(expense =>
          expense.id === action.payload.id ? action.payload : expense
        )
      };

    case 'DELETE_PLANNED_EXPENSE':
      return {
        ...state,
        plannedExpenses: state.plannedExpenses.filter(expense => expense.id !== action.payload)
      };

    case 'ADD_EXCHANGE_RATE':
      return {
        ...state,
        exchangeRates: [...state.exchangeRates, action.payload]
      };
    
    case 'UPDATE_SETTINGS':
      return {
        ...state,
        settings: { ...state.settings, ...action.payload }
      };
    
    default:
      return state;
  }
};

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('expenseTrackerData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        dispatch({ type: 'LOAD_DATA', payload: parsedData });
      } catch (error) {
        console.error('Error loading data from localStorage:', error);
      }
    }
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('expenseTrackerData', JSON.stringify(state));
  }, [state]);

  // Auto-add recurring expenses on load
  useEffect(() => {
    if (state.settings.autoAddRecurring) {
      checkAndAddDueRecurringExpenses();
    }
  }, [state.recurringExpenses, state.settings.autoAddRecurring]);

  const checkAndAddDueRecurringExpenses = () => {
    const today = new Date();
    
    state.recurringExpenses.forEach(recurring => {
      const nextDue = getNextDueDate(recurring);
      if (isAfter(today, nextDue)) {
        // Check if already added for this period
        const alreadyExists = state.expenses.some(expense => 
          expense.recurringId === recurring.id &&
          new Date(expense.date).toDateString() === nextDue.toDateString()
        );
        
        if (!alreadyExists) {
          const newExpense = {
            amount: recurring.amount,
            category: recurring.category,
            currency: recurring.currency,
            date: nextDue.toISOString(),
            type: 'expense',
            notes: `${recurring.name} (Auto-added)`,
            recurringId: recurring.id
          };
          
          dispatch({ type: 'ADD_EXPENSE', payload: newExpense });
          
          // Update last paid date
          const updatedRecurring = {
            ...recurring,
            lastPaid: nextDue.toISOString()
          };
          dispatch({ type: 'UPDATE_RECURRING_EXPENSE', payload: updatedRecurring });
        }
      }
    });
  };

  const getNextDueDate = (recurring) => {
    const lastPaid = recurring.lastPaid ? parseISO(recurring.lastPaid) : new Date();
    
    switch (recurring.interval) {
      case 'weekly':
        return addWeeks(lastPaid, 1);
      case 'monthly':
        return addMonths(lastPaid, 1);
      case 'yearly':
        return addYears(lastPaid, 1);
      default:
        return addMonths(lastPaid, 1);
    }
  };

  // Action creators
  const addExpense = (expense) => {
    dispatch({ type: 'ADD_EXPENSE', payload: expense });
  };

  const updateExpense = (expense) => {
    dispatch({ type: 'UPDATE_EXPENSE', payload: expense });
  };

  const deleteExpense = (id) => {
    dispatch({ type: 'DELETE_EXPENSE', payload: id });
  };

  const addGoal = (goal) => {
    dispatch({ type: 'ADD_GOAL', payload: goal });
  };

  const updateGoal = (goal) => {
    dispatch({ type: 'UPDATE_GOAL', payload: goal });
  };

  const deleteGoal = (id) => {
    dispatch({ type: 'DELETE_GOAL', payload: id });
  };

  const setBudget = (category, amount) => {
    dispatch({ type: 'SET_BUDGET', payload: { category, amount } });
  };

  const deleteBudget = (category) => {
    dispatch({ type: 'DELETE_BUDGET', payload: category });
  };

  const addRecurringExpense = (expense) => {
    dispatch({ type: 'ADD_RECURRING_EXPENSE', payload: expense });
  };

  const updateRecurringExpense = (expense) => {
    dispatch({ type: 'UPDATE_RECURRING_EXPENSE', payload: expense });
  };

  const deleteRecurringExpense = (id) => {
    dispatch({ type: 'DELETE_RECURRING_EXPENSE', payload: id });
  };

  const addPlannedExpense = (expense) => {
    dispatch({ type: 'ADD_PLANNED_EXPENSE', payload: expense });
  };

  const updatePlannedExpense = (expense) => {
    dispatch({ type: 'UPDATE_PLANNED_EXPENSE', payload: expense });
  };

  const deletePlannedExpense = (id) => {
    dispatch({ type: 'DELETE_PLANNED_EXPENSE', payload: id });
  };

  const addExchangeRate = (rate) => {
    dispatch({ type: 'ADD_EXCHANGE_RATE', payload: rate });
  };

  const updateSettings = (settings) => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: settings });
  };

  const convertToEUR = (amountInIDR) => {
    return amountInIDR / state.settings.exchangeRate;
  };

  const value = {
    ...state,
    addExpense,
    updateExpense,
    deleteExpense,
    addGoal,
    updateGoal,
    deleteGoal,
    setBudget,
    deleteBudget,
    addRecurringExpense,
    updateRecurringExpense,
    deleteRecurringExpense,
    addPlannedExpense,
    updatePlannedExpense,
    deletePlannedExpense,
    addExchangeRate,
    updateSettings,
    convertToEUR,
    getNextDueDate
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};