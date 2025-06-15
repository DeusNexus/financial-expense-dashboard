// src/utils/format.js
export const formatCurrency = (amount, currency = 'IDR') => {
  if (currency === 'IDR') {
    // IDR formatting: use dots as thousands separators, no decimals
    return `Rp ${Math.round(amount).toLocaleString('id-ID')}`;
  }
  
  const formatters = {
    EUR: new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }),
    USD: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
  };

  return formatters[currency]?.format(amount) || `${currency} ${amount.toFixed(2)}`;
};

export const formatInputNumber = (value) => {
  // Format number input with dots as thousands separators
  const numericValue = value.replace(/\D/g, '');
  if (!numericValue) return '';
  
  return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

export const parseInputNumber = (formattedValue) => {
  // Parse formatted input back to number
  return parseFloat(formattedValue.replace(/\./g, '')) || 0;
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