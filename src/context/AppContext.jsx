import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const AppContext = createContext();

const initialState = {
  expenses: [],
  goals: [],
  settings: {
    defaultCurrency: 'EUR',
    exchangeRates: { 'EUR_IDR': 16000 },
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

  const updateSettings = (settings) => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: settings });
  };

  const value = {
    ...state,
    addExpense,
    updateExpense,
    deleteExpense,
    addGoal,
    updateGoal,
    deleteGoal,
    updateSettings
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