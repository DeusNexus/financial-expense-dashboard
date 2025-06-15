import React from 'react';
import { calculateSpendingTrends } from '../../utils/dataAnalysis';

const AlertBanner = ({ expenses }) => {
  const trends = calculateSpendingTrends(expenses);

  if (!trends || !trends.isAboveAverage) {
    return null;
  }

  return (
    <div className="alert-banner warning">
      ⚠️ This month's spending is {trends.changePercent.toFixed(1)}% above your usual average
    </div>
  );
};

export default AlertBanner;