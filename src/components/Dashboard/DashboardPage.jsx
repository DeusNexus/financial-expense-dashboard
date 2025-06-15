import React, { useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import StatsCards from './StatsCards';
import NetSavingsChart from './NetSavingsChart';
import CategoryPieChart from './CategoryPieChart';
import IncomeExpenseBarChart from './IncomeExpenseBarChart';
import TopExpensesList from './TopExpensesList';
import AlertBanner from './AlertBanner';
import { calculateMonthlyTotals, calculateCategoryTotals, getTopExpenses } from '../../utils/dataAnalysis';
import './DashboardPage.css';

const DashboardPage = () => {
  const { expenses, settings } = useApp();

  const dashboardData = useMemo(() => {
    const monthlyTotals = calculateMonthlyTotals(expenses);
    const categoryTotals = calculateCategoryTotals(expenses);
    const topExpenses = getTopExpenses(expenses, 5);
    
    return {
      monthlyTotals,
      categoryTotals,
      topExpenses
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
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;