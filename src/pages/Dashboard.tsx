import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStocks } from '../contexts/StockContext';
import { useUser } from '../contexts/UserContext';
import { ArrowUpRight, ArrowDownRight, TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
const Dashboard = () => {
  const {
    stocks,
    loading
  } = useStocks();
  const {
    balance
  } = useUser();
  const navigate = useNavigate();
  const [marketTrend, setMarketTrend] = useState({
    up: 0,
    down: 0
  });
  useEffect(() => {
    if (stocks.length > 0) {
      const upStocks = stocks.filter(stock => stock.change > 0).length;
      setMarketTrend({
        up: upStocks,
        down: stocks.length - upStocks
      });
    }
  }, [stocks]);
  if (loading) {
    return <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <TrendingUp className="w-12 h-12 mx-auto text-blue-500 animate-pulse" />
          <p className="mt-4 text-lg">Loading market data...</p>
        </div>
      </div>;
  }
  const handleStockClick = (stockId: string) => {
    navigate(`/stock/${stockId}`);
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
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Market Dashboard</h1>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <p className="text-sm text-gray-500">Available Balance</p>
          <p className="text-xl font-bold">{formatIndianCurrency(balance)}</p>
        </div>
      </div>
      {/* Market Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <p className="text-sm text-gray-500">Total Stocks</p>
          <p className="text-3xl font-bold">{stocks.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <p className="text-sm text-gray-500">Stocks Up</p>
          <div className="flex items-center">
            <p className="text-3xl font-bold text-green-600">
              {marketTrend.up}
            </p>
            <ArrowUpRight className="w-5 h-5 ml-2 text-green-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <p className="text-sm text-gray-500">Stocks Down</p>
          <div className="flex items-center">
            <p className="text-3xl font-bold text-red-600">
              {marketTrend.down}
            </p>
            <ArrowDownRight className="w-5 h-5 ml-2 text-red-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <p className="text-sm text-gray-500">Market Sentiment</p>
          <p className="text-3xl font-bold">
            {marketTrend.up > marketTrend.down ? 'Bullish' : marketTrend.up < marketTrend.down ? 'Bearish' : 'Neutral'}
          </p>
        </div>
      </div>
      {/* Stock List */}
      <div className="bg-white rounded-lg shadow-sm mb-8">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">Stock Listings</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 text-gray-700">
              <tr>
                <th className="py-3 px-6 text-left">Symbol</th>
                <th className="py-3 px-6 text-left">Company</th>
                <th className="py-3 px-6 text-right">Price</th>
                <th className="py-3 px-6 text-right">Change</th>
                <th className="py-3 px-6 text-right">Volume</th>
                <th className="py-3 px-6 text-right">Market Cap</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {stocks.map(stock => <tr key={stock.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => handleStockClick(stock.id)}>
                  <td className="py-4 px-6 font-medium">{stock.symbol}</td>
                  <td className="py-4 px-6">{stock.name}</td>
                  <td className="py-4 px-6 text-right">
                    ₹{stock.currentPrice.toFixed(2)}
                  </td>
                  <td className={`py-4 px-6 text-right ${stock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    <div className="flex items-center justify-end">
                      {stock.change >= 0 ? <ArrowUpRight className="w-4 h-4 mr-1" /> : <ArrowDownRight className="w-4 h-4 mr-1" />}
                      {stock.change.toFixed(2)} (
                      {stock.changePercent.toFixed(2)}%)
                    </div>
                  </td>
                  <td className="py-4 px-6 text-right">
                    {(stock.volume / 1000).toFixed(1)}K
                  </td>
                  <td className="py-4 px-6 text-right">
                    {formatIndianCurrency(stock.marketCap)}
                  </td>
                </tr>)}
            </tbody>
          </table>
        </div>
      </div>
      {/* Market Trend Chart */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Market Trend</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={stocks[0]?.priceHistory || []} margin={{
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
              <YAxis />
              <Tooltip formatter={value => [`₹${value}`, 'Price']} labelFormatter={label => `Date: ${new Date(label).toLocaleDateString()}`} />
              <Line type="monotone" dataKey="price" stroke="#3b82f6" strokeWidth={2} dot={false} activeDot={{
              r: 6
            }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>;
};
export default Dashboard;