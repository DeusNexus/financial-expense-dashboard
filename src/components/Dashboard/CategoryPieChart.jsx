import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d', '#ffc658', '#ff7300'];

const CategoryPieChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="chart-wrapper">
        <h3>Spending by Category</h3>
        <div style={{ textAlign: 'center', padding: '50px', color: '#666' }}>
          No expense data available
        </div>
      </div>
    );
  }

  return (
    <div className="chart-wrapper">
      <h3>Spending by Category</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `€${value.toFixed(2)}`} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CategoryPieChart;