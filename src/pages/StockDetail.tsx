import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStocks } from '../contexts/StockContext';
import { useUser } from '../contexts/UserContext';
import { ArrowUpRight, ArrowDownRight, TrendingUp, ArrowLeft } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
const StockDetail = () => {
  const {
    stockId
  } = useParams();
  const {
    stocks
  } = useStocks();
  const {
    balance,
    buyStock,
    sellStock,
    holdings
  } = useUser();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  if (!stockId) {
    navigate('/dashboard');
    return null;
  }
  const stock = stocks.find(s => s.id === stockId);
  if (!stock) {
    return <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="mt-4 text-lg">Stock not found</p>
          <button onClick={() => navigate('/dashboard')} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md">
            Back to Dashboard
          </button>
        </div>
      </div>;
  }
  const currentHolding = holdings.find(h => h.stockId === stockId);
  const totalCost = stock.currentPrice * quantity;
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (value > 0) {
      setQuantity(value);
    }
  };
  const handleBuy = () => {
    try {
      setError('');
      setSuccess('');
      if (totalCost > balance) {
        setError('Insufficient funds');
        return;
      }
      buyStock(stock, quantity);
      setSuccess(`Successfully purchased ${quantity} shares of ${stock.symbol}`);
    } catch (err: any) {
      setError(err.message || 'Failed to buy stock');
    }
  };
  const handleSell = () => {
    try {
      setError('');
      setSuccess('');
      if (!currentHolding || currentHolding.quantity < quantity) {
        setError(`You don't have enough shares to sell`);
        return;
      }
      sellStock(stock, quantity);
      setSuccess(`Successfully sold ${quantity} shares of ${stock.symbol}`);
    } catch (err: any) {
      setError(err.message || 'Failed to sell stock');
    }
  };
  // Format currency in Indian format
  const formatIndianCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };
  return <div className="p-6">
      <button onClick={() => navigate('/dashboard')} className="flex items-center text-blue-600 mb-6">
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back to Dashboard
      </button>
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Stock Info */}
        <div className="lg:w-2/3">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {stock.name}
                </h1>
                <p className="text-lg text-gray-500">
                  {stock.symbol} • {stock.sector}
                </p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold">
                  ₹{stock.currentPrice.toFixed(2)}
                </p>
                <div className={`flex items-center justify-end ${stock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {stock.change >= 0 ? <ArrowUpRight className="w-5 h-5 mr-1" /> : <ArrowDownRight className="w-5 h-5 mr-1" />}
                  {stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div>
                <p className="text-sm text-gray-500">Previous Close</p>
                <p className="font-semibold">
                  ₹{stock.previousClose.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Day's Range</p>
                <p className="font-semibold">
                  ₹{stock.low.toFixed(2)} - ₹{stock.high.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Volume</p>
                <p className="font-semibold">
                  {(stock.volume / 1000).toFixed(1)}K
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Market Cap</p>
                <p className="font-semibold">
                  {formatIndianCurrency(stock.marketCap)}
                </p>
              </div>
            </div>
            {/* Stock Chart */}
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stock.priceHistory} margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5
              }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={{
                  fontSize: 12
                }} tickFormatter={value => {
                  const date = new Date(value);
                  return `${date.getDate()}/${date.getMonth() + 1}`;
                }} />
                  <YAxis domain={['dataMin - 50', 'dataMax + 50']} />
                  <Tooltip formatter={value => [`₹${value}`, 'Price']} labelFormatter={label => `Date: ${new Date(label).toLocaleDateString()}`} />
                  <Line type="monotone" dataKey="price" stroke={stock.change >= 0 ? '#10b981' : '#ef4444'} strokeWidth={2} dot={false} activeDot={{
                  r: 6
                }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        {/* Trading Panel */}
        <div className="lg:w-1/3">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Trade {stock.symbol}
            </h2>
            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>}
            {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                {success}
              </div>}
            <div className="mb-6">
              <p className="text-sm text-gray-500 mb-1">Your Balance</p>
              <p className="font-bold text-xl">
                {formatIndianCurrency(balance)}
              </p>
            </div>
            {currentHolding && <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Current Holdings</p>
                <p className="font-bold">{currentHolding.quantity} shares</p>
                <p className="text-sm">
                  Avg. Buy Price: ₹{currentHolding.averageBuyPrice.toFixed(2)}
                </p>
                <div className={`text-sm ${currentHolding.averageBuyPrice < stock.currentPrice ? 'text-green-600' : 'text-red-600'}`}>
                  {currentHolding.averageBuyPrice < stock.currentPrice ? 'Profit' : 'Loss'}
                  : ₹
                  {Math.abs(currentHolding.quantity * (stock.currentPrice - currentHolding.averageBuyPrice)).toFixed(2)}
                </div>
              </div>}
            <div className="mb-4">
              <label htmlFor="quantity" className="block text-gray-700 font-medium mb-2">
                Quantity
              </label>
              <input id="quantity" type="number" min="1" value={quantity} onChange={handleQuantityChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-1">Total Cost</p>
              <p className="font-bold">₹{totalCost.toFixed(2)}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button onClick={handleBuy} className="py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500">
                Buy
              </button>
              <button onClick={handleSell} disabled={!currentHolding || currentHolding.quantity < quantity} className="py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50">
                Sell
              </button>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              About {stock.name}
            </h2>
            <p className="text-gray-700 mb-4">
              {stock.name} is a leading company in the {stock.sector} sector of
              the Indian market. The company has shown{' '}
              {stock.change >= 0 ? 'positive' : 'negative'} performance recently
              with a{stock.change >= 0 ? ' gain ' : ' loss '} of{' '}
              {Math.abs(stock.changePercent).toFixed(2)}% today.
            </p>
            <p className="text-gray-700">
              With a market capitalization of{' '}
              {formatIndianCurrency(stock.marketCap)}, it is considered a
              {stock.marketCap > 5000000000000 ? ' large' : stock.marketCap > 1000000000000 ? ' mid' : ' small'}
              -cap company in the Indian stock market.
            </p>
          </div>
        </div>
      </div>
    </div>;
};
export default StockDetail;