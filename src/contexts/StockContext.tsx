import React, { useEffect, useState, createContext, useContext } from 'react';
export type Stock = {
  id: string;
  symbol: string;
  name: string;
  currentPrice: number;
  previousClose: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  volume: number;
  marketCap: number;
  sector: string;
  priceHistory: {
    date: string;
    price: number;
  }[];
};
type StockContextType = {
  stocks: Stock[];
  loading: boolean;
  error: string | null;
  addStock: (stock: Omit<Stock, 'id' | 'change' | 'changePercent' | 'priceHistory'>) => void;
  updateStock: (id: string, data: Partial<Stock>) => void;
  deleteStock: (id: string) => void;
  simulateMarketMovement: () => void;
};
const StockContext = createContext<StockContextType | undefined>(undefined);
export function useStocks() {
  const context = useContext(StockContext);
  if (context === undefined) {
    throw new Error('useStocks must be used within a StockProvider');
  }
  return context;
}
// Generate random price history for the past 30 days
const generatePriceHistory = (basePrice: number) => {
  const history = [];
  const today = new Date();
  for (let i = 30; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    // Generate a price with some randomness around the base price
    const randomFactor = 0.9 + Math.random() * 0.2; // Between 0.9 and 1.1
    const price = basePrice * randomFactor;
    history.push({
      date: date.toISOString().split('T')[0],
      price: parseFloat(price.toFixed(2))
    });
  }
  return history;
};
// Initial stock data for Indian market
const initialStocks: Stock[] = [{
  id: '1',
  symbol: 'RELIANCE',
  name: 'Reliance Industries',
  currentPrice: 2540.75,
  previousClose: 2525.3,
  change: 15.45,
  changePercent: 0.61,
  high: 2550.2,
  low: 2520.1,
  volume: 5420000,
  marketCap: 17150000000000,
  sector: 'Energy',
  priceHistory: generatePriceHistory(2540)
}, {
  id: '2',
  symbol: 'TCS',
  name: 'Tata Consultancy Services',
  currentPrice: 3450.25,
  previousClose: 3470.8,
  change: -20.55,
  changePercent: -0.59,
  high: 3475.5,
  low: 3440.75,
  volume: 1250000,
  marketCap: 12650000000000,
  sector: 'IT',
  priceHistory: generatePriceHistory(3450)
}, {
  id: '3',
  symbol: 'HDFCBANK',
  name: 'HDFC Bank',
  currentPrice: 1680.5,
  previousClose: 1665.2,
  change: 15.3,
  changePercent: 0.92,
  high: 1695.0,
  low: 1670.25,
  volume: 3560000,
  marketCap: 9320000000000,
  sector: 'Financial Services',
  priceHistory: generatePriceHistory(1680)
}, {
  id: '4',
  symbol: 'INFY',
  name: 'Infosys',
  currentPrice: 1420.75,
  previousClose: 1435.6,
  change: -14.85,
  changePercent: -1.03,
  high: 1438.5,
  low: 1415.3,
  volume: 2890000,
  marketCap: 5980000000000,
  sector: 'IT',
  priceHistory: generatePriceHistory(1420)
}, {
  id: '5',
  symbol: 'BHARTIARTL',
  name: 'Bharti Airtel',
  currentPrice: 875.2,
  previousClose: 860.4,
  change: 14.8,
  changePercent: 1.72,
  high: 880.75,
  low: 865.9,
  volume: 1850000,
  marketCap: 4850000000000,
  sector: 'Telecommunication',
  priceHistory: generatePriceHistory(875)
}];
export const StockProvider: React.FC<{
  children: React.ReactNode;
}> = ({
  children
}) => {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    // Check localStorage for stocks first
    const storedStocks = localStorage.getItem('mockStocks');
    if (storedStocks) {
      setStocks(JSON.parse(storedStocks));
    } else {
      // Use initial stocks if none in localStorage
      setStocks(initialStocks);
      localStorage.setItem('mockStocks', JSON.stringify(initialStocks));
    }
    setLoading(false);
    // Set up interval for market movement simulation
    const interval = setInterval(() => {
      simulateMarketMovement();
    }, 60000); // Simulate market movement every minute
    return () => clearInterval(interval);
  }, []);
  // Save stocks to localStorage whenever they change
  useEffect(() => {
    if (!loading && stocks.length > 0) {
      localStorage.setItem('mockStocks', JSON.stringify(stocks));
    }
  }, [stocks, loading]);
  const addStock = (stockData: Omit<Stock, 'id' | 'change' | 'changePercent' | 'priceHistory'>) => {
    const newStock: Stock = {
      ...stockData,
      id: `${Date.now()}`,
      change: 0,
      changePercent: 0,
      priceHistory: generatePriceHistory(stockData.currentPrice)
    };
    setStocks(prev => [...prev, newStock]);
  };
  const updateStock = (id: string, data: Partial<Stock>) => {
    setStocks(prev => prev.map(stock => stock.id === id ? {
      ...stock,
      ...data
    } : stock));
  };
  const deleteStock = (id: string) => {
    setStocks(prev => prev.filter(stock => stock.id !== id));
  };
  const simulateMarketMovement = () => {
    setStocks(prev => prev.map(stock => {
      // Random price movement between -1.5% and +1.5%
      const movementPercent = (Math.random() * 3 - 1.5) / 100;
      const newPrice = parseFloat((stock.currentPrice * (1 + movementPercent)).toFixed(2));
      const change = parseFloat((newPrice - stock.previousClose).toFixed(2));
      const changePercent = parseFloat((change / stock.previousClose * 100).toFixed(2));
      // Add new price to price history
      const today = new Date().toISOString().split('T')[0];
      const updatedPriceHistory = [...stock.priceHistory];
      // If today's date already exists, update it, otherwise add it
      const todayIndex = updatedPriceHistory.findIndex(item => item.date === today);
      if (todayIndex >= 0) {
        updatedPriceHistory[todayIndex].price = newPrice;
      } else {
        updatedPriceHistory.push({
          date: today,
          price: newPrice
        });
      }
      return {
        ...stock,
        currentPrice: newPrice,
        change,
        changePercent,
        high: Math.max(stock.high, newPrice),
        low: Math.min(stock.low, newPrice),
        priceHistory: updatedPriceHistory
      };
    }));
  };
  const value = {
    stocks,
    loading,
    error,
    addStock,
    updateStock,
    deleteStock,
    simulateMarketMovement
  };
  return <StockContext.Provider value={value}>{children}</StockContext.Provider>;
};