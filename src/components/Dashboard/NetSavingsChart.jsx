import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '../../utils/format';

const NetSavingsChart = ({ data }) => {
  const chartData = data.map((item, index) => ({
    ...item,
    cumulative: data.slice(0, index + 1).reduce((sum, d) => sum + d.net, 0)
  }));

  return (
    <div className="chart-wrapper">
      <h3>Net Savings Over Time</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis tickFormatter={(value) => formatCurrency(value)} />
          <Tooltip formatter={(value) => [formatCurrency(value), 'Cumulative Savings']} />
          <Line 
            type="monotone" 
            dataKey="cumulative" 
            stroke="#8884d8" 
            strokeWidth={2}
            dot={{ fill: '#8884d8' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default NetSavingsChart;