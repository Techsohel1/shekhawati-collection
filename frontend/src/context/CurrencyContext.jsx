import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_URL } from '../config';

const CurrencyContext = createContext();

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState('USD');
  const [rates, setRates] = useState({
    USD: 1.00,
    GBP: 0.79,
    EUR: 0.92,
    CAD: 1.37,
    AUD: 1.50
  });

  useEffect(() => {
    // Load currency preference from localStorage
    const savedCurrency = localStorage.getItem('sc_currency');
    if (savedCurrency) {
      setCurrency(savedCurrency);
    }

    // Proactively fetch live exchange rates from our backend
    fetch(`${API_URL}/api/utils/exchange-rates`)
      .then(res => res.json())
      .then(data => {
        if (data && data.rates) {
          setRates(data.rates);
        }
      })
      .catch(err => console.log('Using local hardcoded fallback exchange rates:', err));
  }, []);

  const changeCurrency = (newCurrency) => {
    if (rates[newCurrency]) {
      setCurrency(newCurrency);
      localStorage.setItem('sc_currency', newCurrency);
    }
  };

  const convertPrice = (priceInUSD) => {
    const rate = rates[currency] || 1.00;
    return parseFloat((priceInUSD * rate).toFixed(2));
  };

  const formatPrice = (priceInUSD) => {
    const converted = convertPrice(priceInUSD);
    const symbols = {
      USD: '$',
      GBP: '£',
      EUR: '€',
      CAD: 'C$',
      AUD: 'A$'
    };
    const symbol = symbols[currency] || '$';
    return `${symbol}${converted.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, rates, changeCurrency, convertPrice, formatPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);
