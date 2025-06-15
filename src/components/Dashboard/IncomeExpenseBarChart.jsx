import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { formatCurrency } from '../../utils/format';

const IncomeExpenseBarChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="chart-wrapper">
        <h3>Income vs Expenses</h3>
        <div style={{ textAlign: 'center', padding: '50px', color: '#666' }}>
          No data available
        </div>
      </div>
    );
  }

  return (
    <div className="chart-wrapper">
      <h3>Income vs Expenses</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis tickFormatter={(value) => formatCurrency(value)} />
          <Tooltip formatter={(value) => formatCurrency(value)} />
          <Legend />
          <Bar dataKey="income" fill="#82ca9d" name="Income" />
          <Bar dataKey="expenses" fill="#8884d8" name="Expenses" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default IncomeExpenseBarChart;