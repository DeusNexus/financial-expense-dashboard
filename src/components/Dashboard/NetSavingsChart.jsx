// src/components/Dashboard/NetSavingsChart.jsx
import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '../../utils/format';
import { format, parseISO, startOfWeek, startOfDay, isWithinInterval } from 'date-fns';

const NetSavingsChart = ({ data }) => {
  const [groupBy, setGroupBy] = useState('monthly'); // monthly, weekly, daily

  const chartData = useMemo(() => {
    let processedData = [];
    
    if (groupBy === 'monthly') {
      processedData = data.map((item, index) => ({
        ...item,
        cumulative: data.slice(0, index + 1).reduce((sum, d) => sum + d.net, 0)
      }));
    } else if (groupBy === 'weekly') {
      // Group by weeks (last 12 weeks)
      const weeks = [];
      const now = new Date();
      
      for (let i = 11; i >= 0; i--) {
        const weekStart = startOfWeek(new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000));
        const weekEnd = new Date(weekStart.getTime() + 6 * 24 * 60 * 60 * 1000);
        
        weeks.push({
          period: format(weekStart, 'MMM dd'),
          start: weekStart,
          end: weekEnd,
          net: 0
        });
      }
      
      // You would need to implement weekly grouping logic here
      processedData = weeks.map((week, index) => ({
        ...week,
        cumulative: weeks.slice(0, index + 1).reduce((sum, w) => sum + w.net, 0)
      }));
    } else if (groupBy === 'daily') {
      // Group by days (last 30 days)
      const days = [];
      const now = new Date();
      
      for (let i = 29; i >= 0; i--) {
        const day = startOfDay(new Date(now.getTime() - i * 24 * 60 * 60 * 1000));
        days.push({
          period: format(day, 'dd/MM'),
          date: day,
          net: 0
        });
      }
      
      processedData = days.map((day, index) => ({
        ...day,
        cumulative: days.slice(0, index + 1).reduce((sum, d) => sum + d.net, 0)
      }));
    }
    
    return processedData;
  }, [data, groupBy]);

  return (
    <div className="chart-wrapper">
      <div className="chart-header">
        <h3>Net Savings Over Time</h3>
        <div className="chart-controls">
          <select 
            value={groupBy} 
            onChange={(e) => setGroupBy(e.target.value)}
            className="period-select"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="period" 
            tick={{ fontSize: 12 }}
            interval="preserveStartEnd"
          />
          <YAxis 
            tickFormatter={(value) => formatCurrency(value)}
            tick={{ fontSize: 12 }}
            width={100}
          />
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