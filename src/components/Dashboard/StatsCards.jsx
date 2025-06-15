import React from 'react';
import { format } from 'date-fns';
import { formatCurrency } from '../../utils/format';
import './StatsCards.css';

const StatsCards = ({ data }) => {
  const currentMonth = format(new Date(), 'yyyy-MM');
  const lastMonth = format(new Date(new Date().setMonth(new Date().getMonth() - 1)), 'yyyy-MM');
  
  const currentMonthData = data.find(d => d.month === currentMonth) || { income: 0, expenses: 0, net: 0 };
  const lastMonthData = data.find(d => d.month === lastMonth) || { income: 0, expenses: 0, net: 0 };

  const calculateChange = (current, previous) => {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
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
            <p className="stat-value">{formatCurrency(stat.value)}</p>
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