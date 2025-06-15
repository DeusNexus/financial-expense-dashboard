export const formatCurrency = (amount, currency = 'EUR') => {
  const formatters = {
    EUR: new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }),
    IDR: new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }),
    USD: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
  };

  return formatters[currency]?.format(amount) || `${currency} ${amount.toFixed(2)}`;
};

export const formatDate = (date, format = 'dd/MM/yyyy') => {
  if (typeof date === 'string') {
    date = new Date(date);
  }
  return date.toLocaleDateString('en-GB');
};

export const formatPercentage = (value, decimals = 1) => {
  return `${value.toFixed(decimals)}%`;
};