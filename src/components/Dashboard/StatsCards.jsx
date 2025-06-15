// src/components/Dashboard/StatsCards.jsx
import React from 'react';
import { format } from 'date-fns';
import { formatCurrency } from '../../utils/format';
import { useApp } from '../../context/AppContext';
import './StatsCards.css';

const StatsCards = ({ data }) => {
  const { settings, convertToEUR } = useApp();
  const currentMonth = format(new Date(), 'yyyy-MM');
  const lastMonth = format(new Date(new Date().setMonth(new Date().getMonth() - 1)), 'yyyy-MM');
  
  const currentMonthData = data.find(d => d.month === currentMonth) || { income: 0, expenses: 0, net: 0 };
  const lastMonthData = data.find(d => d.month === lastMonth) || { income: 0, expenses: 0, net: 0 };

  const calculateChange = (current, previous) => {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  const formatWithConversion = (amount, isPrimary = true) => {
    if (settings.defaultCurrency === 'IDR') {
      if (isPrimary) {
        return formatCurrency(amount, 'IDR');
      } else if (settings.showEurEquivalent) {
        return formatCurrency(convertToEUR(amount), 'EUR');
      }
    } else if (settings.defaultCurrency === 'EUR') {
      if (isPrimary) {
        return formatCurrency(amount, 'EUR');
      } else {
        // Convert EUR to IDR
        return formatCurrency(amount * settings.exchangeRate, 'IDR');
      }
    }
    return formatCurrency(amount, settings.defaultCurrency);
  };

  const stats = [
    {
      title: 'Monthly Income',
      value: currentMonthData.income,
      change: calculateChange(currentMonthData.income, lastMonthData.income),
      icon: '💰',
      color: 'green'
    },
    {
      title: 'Monthly Expenses',
      value: currentMonthData.expenses,
      change: calculateChange(currentMonthData.expenses, lastMonthData.expenses),
      icon: '💸',
      color: 'red'
    },
    {
      title: 'Net Savings',
      value: currentMonthData.net,
      change: calculateChange(currentMonthData.net, lastMonthData.net),
      icon: '💵',
      color: currentMonthData.net >= 0 ? 'green' : 'red'
    },
    {
      title: 'Total Saved',
      value: data.reduce((sum, month) => sum + month.net, 0),
      change: 0,
      icon: '🏦',
      color: 'blue'
    }
  ];

  return (
    <div className="stats-cards">
      {stats.map((stat, index) => (
        <div key={index} className={`stat-card ${stat.color}`}>
          <div className="stat-icon">{stat.icon}</div>
          <div className="stat-content">
            <h3 className="stat-title">{stat.title}</h3>
            <div className="stat-value-container">
              <p className="stat-value">{formatWithConversion(stat.value, true)}</p>
              {settings.showEurEquivalent && (
                <p className="stat-value-secondary">
                  {formatWithConversion(stat.value, false)}
                </p>
              )}
            </div>
            {stat.change !== 0 && (
              <p className={`stat-change ${stat.change >= 0 ? 'positive' : 'negative'}`}>
                {stat.change >= 0 ? '↑' : '↓'} {Math.abs(stat.change).toFixed(1)}%
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;