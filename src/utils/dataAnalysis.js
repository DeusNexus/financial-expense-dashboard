import { format, parseISO, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';

export const calculateMonthlyTotals = (expenses) => {
  const monthlyData = {};

  expenses.forEach(expense => {
    const month = format(parseISO(expense.date), 'yyyy-MM');
    
    if (!monthlyData[month]) {
      monthlyData[month] = { month, income: 0, expenses: 0, net: 0 };
    }

    if (expense.type === 'income') {
      monthlyData[month].income += expense.amount;
    } else {
      monthlyData[month].expenses += expense.amount;
    }
  });

  // Calculate net for each month
  Object.values(monthlyData).forEach(data => {
    data.net = data.income - data.expenses;
  });

  return Object.values(monthlyData).sort((a, b) => a.month.localeCompare(b.month));
};

export const calculateCategoryTotals = (expenses, period = 'current-month') => {
  let filteredExpenses = expenses;

  if (period === 'current-month') {
    const now = new Date();
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);
    
    filteredExpenses = expenses.filter(expense => {
      const expenseDate = parseISO(expense.date);
      return isWithinInterval(expenseDate, { start: monthStart, end: monthEnd });
    });
  }

  const categoryTotals = {};
  
  filteredExpenses
    .filter(expense => expense.type === 'expense')
    .forEach(expense => {
      if (!categoryTotals[expense.category]) {
        categoryTotals[expense.category] = 0;
      }
      categoryTotals[expense.category] += expense.amount;
    });

  return Object.entries(categoryTotals).map(([name, value]) => ({
    name,
    value
  }));
};

export const getTopExpenses = (expenses, limit = 5) => {
  return expenses
    .filter(expense => expense.type === 'expense')
    .sort((a, b) => b.amount - a.amount)
    .slice(0, limit);
};

export const calculateSpendingTrends = (expenses) => {
  const monthlyTotals = calculateMonthlyTotals(expenses);
  const currentMonth = monthlyTotals[monthlyTotals.length - 1];
  const previousMonths = monthlyTotals.slice(-4, -1); // Last 3 months excluding current
  
  if (previousMonths.length === 0) return null;

  const avgPreviousExpenses = previousMonths.reduce((sum, month) => sum + month.expenses, 0) / previousMonths.length;
  const currentExpenses = currentMonth?.expenses || 0;
  
  const changePercent = ((currentExpenses - avgPreviousExpenses) / avgPreviousExpenses) * 100;
  
  return {
    currentExpenses,
    avgPreviousExpenses,
    changePercent,
    isAboveAverage: changePercent > 20 // Alert if 20% above average
  };
};