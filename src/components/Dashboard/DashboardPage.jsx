// src/components/Dashboard/DashboardPage.jsx
import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import StatsCards from './StatsCards';
import NetSavingsChart from './NetSavingsChart';
import CategoryPieChart from './CategoryPieChart';
import IncomeExpenseBarChart from './IncomeExpenseBarChart';
import TopExpensesList from './TopExpensesList';
import PlannedExpensesList from './PlannedExpensesList';
import GoalsList from './GoalsList';
import AlertBanner from './AlertBanner';
import BudgetCard from '../Budgets/BudgetCard';
import BudgetManager from '../Budgets/BudgetManager';
import { calculateMonthlyTotals, calculateCategoryTotals, getTopExpenses } from '../../utils/dataAnalysis';
import './DashboardPage.css';

const DashboardPage = () => {
  const { expenses, budgets, settings } = useApp();
  const [showBudgetManager, setShowBudgetManager] = useState(false);

  const dashboardData = useMemo(() => {
    const monthlyTotals = calculateMonthlyTotals(expenses);
    const categoryTotals = calculateCategoryTotals(expenses);
    const topExpenses = getTopExpenses(expenses, 5);
    
    // Calculate current month spending by category for budget cards
    const currentMonth = new Date();
    const currentMonthExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate.getMonth() === currentMonth.getMonth() &&
             expenseDate.getFullYear() === currentMonth.getFullYear() &&
             expense.type === 'expense';
    });

    const categorySpending = {};
    currentMonthExpenses.forEach(expense => {
      categorySpending[expense.category] = (categorySpending[expense.category] || 0) + expense.amount;
    });

    const totalSpent = Object.values(categorySpending).reduce((sum, amount) => sum + amount, 0);
    
    return {
      monthlyTotals,
      categoryTotals,
      topExpenses,
      categorySpending,
      totalSpent
    };
  }, [expenses]);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
      </div>

      <AlertBanner expenses={expenses} />

      <div className="dashboard-grid">
        <div className="stats-section">
          <StatsCards data={dashboardData.monthlyTotals} />
        </div>

        {/* Budget Cards Section */}
        {Object.keys(budgets).length > 0 && (
          <div className="budgets-section">
            <div className="section-header">
              <h2>Budget Overview</h2>
              <button 
                onClick={() => setShowBudgetManager(true)}
                className="btn-secondary btn-small"
              >
                Manage Budgets
              </button>
            </div>
            <div className="budget-cards-grid">
              {Object.entries(budgets).map(([category, budget]) => (
                <BudgetCard
                  key={category}
                  category={category}
                  budget={budget}
                  spent={dashboardData.categorySpending[category] || 0}
                  totalSpent={dashboardData.totalSpent}
                />
              ))}
            </div>
          </div>
        )}

        <div className="charts-section">
          <div className="chart-row">
            <div className="chart-container">
              <NetSavingsChart data={dashboardData.monthlyTotals} />
            </div>
            <div className="chart-container">
              <CategoryPieChart data={dashboardData.categoryTotals} />
            </div>
          </div>

          <div className="chart-row">
            <div className="chart-container">
              <IncomeExpenseBarChart data={dashboardData.monthlyTotals} />
            </div>
            <div className="chart-container">
              <TopExpensesList expenses={dashboardData.topExpenses} />
            </div>
          </div>

          <div className="chart-row">
            <div className="chart-container">
              <PlannedExpensesList />
            </div>
            <div className="chart-container">
              <GoalsList />
            </div>
          </div>
        </div>

        {Object.keys(budgets).length === 0 && (
          <div className="budget-prompt">
            <h3>Set up your budgets</h3>
            <p>Track your spending against monthly budgets for better financial control.</p>
            <button 
              onClick={() => setShowBudgetManager(true)}
              className="btn-primary"
            >
              Create Your First Budget
            </button>
          </div>
        )}
      </div>

      {showBudgetManager && (
        <BudgetManager 
          isOpen={showBudgetManager}
          onClose={() => setShowBudgetManager(false)}
        />
      )}
    </div>
  );
};

export default DashboardPage;