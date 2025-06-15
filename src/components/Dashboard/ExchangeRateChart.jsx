// src/components/Dashboard/ExchangeRateChart.jsx
import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useApp } from '../../context/AppContext';
import { formatDate } from '../../utils/format';

const ExchangeRateChart = () => {
  const { exchangeRates, addExchangeRate, settings } = useApp();
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    // Generate last 30 days of exchange rate data
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      return date;
    });

    // Create chart data with actual rates or interpolated values
    const data = last30Days.map(date => {
      const dateStr = date.toISOString().split('T')[0];
      const existingRate = exchangeRates.find(r => r.date === dateStr);
      
      return {
        date: formatDate(date, 'MM/dd'),
        rate: existingRate ? existingRate.rate : settings.exchangeRate,
        fullDate: dateStr
      };
    });

    setChartData(data);
  }, [exchangeRates, settings.exchangeRate]);

  const fetchLatestRate = async () => {
    try {
      // Example API call - replace with actual exchange rate service
      const response = await fetch('https://api.exchangerate-api.com/v4/latest/EUR');
      const data = await response.json();
      const newRate = data.rates.IDR;
      
      const today = new Date().toISOString().split('T')[0];
      addExchangeRate({
        date: today,
        rate: newRate,
        source: 'API'
      });
    } catch (error) {
      console.error('Failed to fetch exchange rate:', error);
    }
  };

  return (
    <div className="chart-wrapper">
      <div className="chart-header">
        <h3>EUR/IDR Exchange Rate - 30 Days</h3>
        <button onClick={fetchLatestRate} className="btn-small">
          Update Rate
        </button>
      </div>
      
      <div className="current-rate">
        <strong>1 EUR = Rp {settings.exchangeRate.toLocaleString()}</strong>
      </div>
      
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis 
            domain={['dataMin - 100', 'dataMax + 100']}
            tickFormatter={(value) => `${value.toLocaleString()}`}
          />
          <Tooltip 
            formatter={(value) => [`Rp ${value.toLocaleString()}`, 'Rate']}
            labelFormatter={(label) => `Date: ${label}`}
          />
          <Line 
            type="monotone" 
            dataKey="rate" 
            stroke="#2196f3" 
            strokeWidth={2}
            dot={{ fill: '#2196f3', r: 3 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ExchangeRateChart;