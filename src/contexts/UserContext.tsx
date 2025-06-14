import React, { useEffect, useState, createContext, useContext } from 'react';
import { useAuth } from './AuthContext';
import { Stock } from './StockContext';
export type StockHolding = {
  stockId: string;
  symbol: string;
  name: string;
  quantity: number;
  averageBuyPrice: number;
  currentValue: number;
};
export type Transaction = {
  id: string;
  type: 'BUY' | 'SELL' | 'DEPOSIT';
  stockId?: string;
  symbol?: string;
  quantity?: number;
  price?: number;
  amount: number;
  timestamp: string;
};
type UserContextType = {
  balance: number;
  holdings: StockHolding[];
  transactions: Transaction[];
  addFunds: (amount: number) => void;
  buyStock: (stock: Stock, quantity: number) => void;
  sellStock: (stock: Stock, quantity: number) => void;
  updateHoldings: (stocks: Stock[]) => void;
};
const UserContext = createContext<UserContextType | undefined>(undefined);
export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
export const UserProvider: React.FC<{
  children: React.ReactNode;
}> = ({
  children
}) => {
  const {
    currentUser
  } = useAuth();
  const [balance, setBalance] = useState(1000000); // Start with ₹10,00,000
  const [holdings, setHoldings] = useState<StockHolding[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  // Load user data from localStorage when user changes
  useEffect(() => {
    if (currentUser) {
      const userDataKey = `mockStockUser_${currentUser.id}`;
      const userData = localStorage.getItem(userDataKey);
      if (userData) {
        const parsedData = JSON.parse(userData);
        setBalance(parsedData.balance || 1000000);
        setHoldings(parsedData.holdings || []);
        setTransactions(parsedData.transactions || []);
      } else {
        // Initialize new user
        setBalance(1000000);
        setHoldings([]);
        setTransactions([]);
        // Add initial deposit transaction
        const initialDeposit: Transaction = {
          id: '1',
          type: 'DEPOSIT',
          amount: 1000000,
          timestamp: new Date().toISOString()
        };
        setTransactions([initialDeposit]);
      }
    } else {
      // Reset state when user logs out
      setBalance(1000000);
      setHoldings([]);
      setTransactions([]);
    }
  }, [currentUser]);
  // Save user data to localStorage whenever it changes
  useEffect(() => {
    if (currentUser) {
      const userDataKey = `mockStockUser_${currentUser.id}`;
      const userData = {
        balance,
        holdings,
        transactions
      };
      localStorage.setItem(userDataKey, JSON.stringify(userData));
    }
  }, [currentUser, balance, holdings, transactions]);
  const addFunds = (amount: number) => {
    if (amount <= 0) return;
    setBalance(prev => prev + amount);
    const transaction: Transaction = {
      id: `${Date.now()}`,
      type: 'DEPOSIT',
      amount,
      timestamp: new Date().toISOString()
    };
    setTransactions(prev => [transaction, ...prev]);
  };
  const buyStock = (stock: Stock, quantity: number) => {
    if (quantity <= 0) return;
    const totalCost = stock.currentPrice * quantity;
    if (totalCost > balance) {
      throw new Error('Insufficient funds');
    }
    // Update balance
    setBalance(prev => prev - totalCost);
    // Update holdings
    setHoldings(prev => {
      const existingHolding = prev.find(h => h.stockId === stock.id);
      if (existingHolding) {
        // Update existing holding
        const totalShares = existingHolding.quantity + quantity;
        const newAveragePrice = (existingHolding.averageBuyPrice * existingHolding.quantity + stock.currentPrice * quantity) / totalShares;
        return prev.map(h => h.stockId === stock.id ? {
          ...h,
          quantity: totalShares,
          averageBuyPrice: parseFloat(newAveragePrice.toFixed(2)),
          currentValue: totalShares * stock.currentPrice
        } : h);
      } else {
        // Add new holding
        return [...prev, {
          stockId: stock.id,
          symbol: stock.symbol,
          name: stock.name,
          quantity,
          averageBuyPrice: stock.currentPrice,
          currentValue: quantity * stock.currentPrice
        }];
      }
    });
    // Add transaction
    const transaction: Transaction = {
      id: `${Date.now()}`,
      type: 'BUY',
      stockId: stock.id,
      symbol: stock.symbol,
      quantity,
      price: stock.currentPrice,
      amount: totalCost,
      timestamp: new Date().toISOString()
    };
    setTransactions(prev => [transaction, ...prev]);
  };
  const sellStock = (stock: Stock, quantity: number) => {
    if (quantity <= 0) return;
    const holding = holdings.find(h => h.stockId === stock.id);
    if (!holding || holding.quantity < quantity) {
      throw new Error('Insufficient shares');
    }
    const saleAmount = stock.currentPrice * quantity;
    // Update balance
    setBalance(prev => prev + saleAmount);
    // Update holdings
    setHoldings(prev => {
      const updatedHoldings = prev.map(h => {
        if (h.stockId === stock.id) {
          const newQuantity = h.quantity - quantity;
          if (newQuantity === 0) {
            return null; // Will be filtered out
          }
          return {
            ...h,
            quantity: newQuantity,
            currentValue: newQuantity * stock.currentPrice
          };
        }
        return h;
      }).filter(Boolean) as StockHolding[];
      return updatedHoldings;
    });
    // Add transaction
    const transaction: Transaction = {
      id: `${Date.now()}`,
      type: 'SELL',
      stockId: stock.id,
      symbol: stock.symbol,
      quantity,
      price: stock.currentPrice,
      amount: saleAmount,
      timestamp: new Date().toISOString()
    };
    setTransactions(prev => [transaction, ...prev]);
  };
  const updateHoldings = (stocks: Stock[]) => {
    setHoldings(prev => prev.map(holding => {
      const stock = stocks.find(s => s.id === holding.stockId);
      if (stock) {
        return {
          ...holding,
          currentValue: holding.quantity * stock.currentPrice
        };
      }
      return holding;
    }));
  };
  const value = {
    balance,
    holdings,
    transactions,
    addFunds,
    buyStock,
    sellStock,
    updateHoldings
  };
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};